import * as readline from 'readline-sync';
import { Player, Team } from "./interfaces";
import { exit } from 'process';



console.log(" Welkom bij de JSON-gegevensviewer! ")
console.log("1. Bekijk alle gegevens")
console.log("2. Filter op ID")
console.log("3. Sluit")



let choice: number = Number(readline.question("Wat wil je doen?"))



function showData(players: Player[],teams: Team[]){

    for(let player of players){
        console.log(player.name,player.id )
    }

}

function filterByID(players: Player[]) {
    for(let player of players){
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


switch(choice){
    
    case 1: showData(players,teams);
        break;

    case 2: filterByID(players );

    case 3: exit;

}
