import { id, injectable } from 'inversify';
import { Collection, Db, MongoClient } from 'mongodb';
import { token } from 'morgan';
import { User } from '../interfaces';

const url = 'mongodb://127.0.0.1:27017';


@injectable()
/*
* Cette classe s'occupe des communications avec MongoDB
*/
export class MongodbService {

    private _client: MongoClient = new MongoClient(url);
    private _collection: Collection<User>;
    
    constructor(){
        //Pourrait causer des problèmes en production
        this._client.connect();
        //Collection à utiliser
        this._collection = this._client.db('tp2').collection<User>('users');
    }
    
    //Retourne les informations d'un utilisateur à partir de son username
    async getUserByUsername(username: string):Promise<User | null>{
        //Trouve l'utilisateur en fonction de son nom d'utilisateur et retourne l'utilisateur avec son _id.
        const utilisateur: User | null = await this._collection.findOne({username});
        return utilisateur;
    }
    
    //Fait la création d'un utilisateur dans la base de données
    async createUser(username: string, hash: string): Promise<User | null>{
        // Crée un utilisateur en fonction des information d'authentification, utilise l'interface user et retourne le user avec son id (créer automatiquement par mongo)
        // On cherche d'abord l'utilisateur qui vient d'être "créé" et ensuite on l'insere dans la base de donnée avec son nom et son hash
        await this._collection.findOne({username});
        console.log('Création?');
        await this._collection.insertOne({username, hash});
        
        return await this._collection.findOne({username});
    }

}