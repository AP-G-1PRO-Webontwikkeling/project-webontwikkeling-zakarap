import { Collection, MongoClient } from "mongodb";
import {Player, Team } from "./interfaces";
import dotenv from "dotenv"

require('dotenv').config()

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";
export const client = new MongoClient(MONGO_URI);
export const playercollection: Collection<Player> = client.db("zakaria-project").collection<Player>("players");




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


