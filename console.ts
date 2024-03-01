import * as readline from 'readline-sync';
import { Player, players } from "./interfaces";
import { exit } from 'process';
import { copyFileSync } from 'fs';



console.log(" Welkom bij de JSON-gegevensviewer! ")
console.log("1. Bekijk alle gegevens")
console.log("2. Filter op ID")
console.log("3. Sluit")



let choice: number = Number(readline.question("Wat wil je doen?"))


switch(choice){
    
    case 1: showData();
        break;

    case 2: filterByID( players);

    case 3: exit;

}


function showData(){

    for(let player of players){
        console.log(player.name,player.id )
    }

}

function filterByID(player: Player[]) {

    let ID: number = Number(readline.question("Van wie wil je alle info zien?"))

    for(let player of players){

        if(player.id == ID){

            console.log(player.name )
            console.log(player.id)
            console.log(player.position)
            console.log(player.age)
            console.log(player.playing)
            console.log(player.birthDate)
            console.log(player.imageUrl)
            console.log(player.rating)
            console.log(player.trophies)
            console.log(player.birthPlace)
            console.log(player.team.id)
            console.log(player.team.name)
            console.log(player.team.manager)
            console.log(player.team.teamLogoUrl)
            console.log(player.team.createDate)
            console.log(player.team.League)
        }
    }
}