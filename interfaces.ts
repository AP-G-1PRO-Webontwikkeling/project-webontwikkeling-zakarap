import playerdata from "./players.json";
import teamdata from "./teams.json";


export const players: Player[] = playerdata;
export const teams: Team[] = teamdata;


export interface Player {
            id: string,
            name: string,
            position: string,
            age: number,
            Playing: true,
            birthDate: string,
            imageUrl: string ,
            rating: number,
            trophies: string[],
            birthPlace: string ,
            team: Team
            
}

export interface Team{
    
        id: string,
        name: string,
        Manager: string,
        teamLogoUrl: string,
        createDate: string,
        League: string
    
}