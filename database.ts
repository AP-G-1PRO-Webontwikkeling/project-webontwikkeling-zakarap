import { Collection, MongoClient, ObjectId } from "mongodb";
import {Player, Team, User } from "./interfaces";
import dotenv from "dotenv"
import { name } from "ejs";

import bcrypt from "bcrypt";

require('dotenv').config()

export const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";
export const client = new MongoClient(MONGO_URI);
export const playercollection: Collection<Player> = client.db("zakaria-project").collection<Player>("players");
export const userCollection = client.db("zakaria-project").collection<User>("users");


export async function updatePlayerPos(Pos: string, newPos:string) {

    let player = playercollection.findOne<Player>({name: Pos});

    return await playercollection.updateOne({ player }, { $set: {position: newPos}}  );

}


export async function updatePlayerAge(ageInput : number,name:string){

    let player = playercollection.findOne<Player>({name: name});
    return await playercollection.updateOne({ player }, { $set: {age: ageInput}}  );


}


export async function connect() {
    try {
        await client.connect();
        console.log("Connected to database");
        process.on("SIGINT", exit);
    } catch (error) {
        console.error(error);
    }
}

export async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export  async function checkDB() {
    const collectionCount = await playercollection.countDocuments();
    if (collectionCount > 0) {
        console.log("Database is vol")
    }
    else{
        console.log("Databse is leeg en wordt nu gevuld")
        fetchAndPush();
    }
};


export  async function fetchAndPush() {
    fetch('https://raw.githubusercontent.com/zakarap/Webontwikkeling-images/main/players.json')
        .then((response) => response.json())
        .then((response: Player[]) => {
            const result = playercollection.insertMany(response);
        }).catch((error) => {
            console.log(error);
        });
    };

export async function getPlayers() {
    return await playercollection.find().toArray();
}


const saltRounds: number = 10;

export async function registerUser(name: string, password: string) {
    console.log(await bcrypt.hash(password, saltRounds));
    await userCollection.insertOne({
        name: name,
        password: await bcrypt.hash(password, saltRounds),
        role: "USER"
    })
}

export async function login(email: string, password: string) {
    if (email === "" || password === "") {
        throw new Error("Email and password required");
    }
    let user : User | null = await userCollection.findOne<User>({email: email});
    if (user) {
        if (await bcrypt.compare(password, user.password!)) {
            return user;
        } else {
            throw new Error("Password incorrect");
        }
    } else {
        throw new Error("User not found");
    }
}

export async function createInitialUser() {
    if (await userCollection.countDocuments() > 0) {
        return;
    }
    let email : string | undefined = process.env.ADMIN_EMAIL;
    let password : string | undefined = process.env.ADMIN_PASSWORD;
    if (email === undefined || password === undefined) {
        throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    }
    await userCollection.insertOne({
        name: name,
        password: await bcrypt.hash(password, saltRounds),
        role: "ADMIN"
    });
}
