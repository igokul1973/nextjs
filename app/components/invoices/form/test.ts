// Полиморфизм

// Parametric - Мнимый тип

// Ad-Hoc - Истинный тип

/* 
В парадигме ООП полиморфизм - это возможность создавать функции(фрагменты кода), 
которые могут принимать разные типы данных.

Polymorphism in programming gives a program the ability
to redefine methods for derived classes.

*/


class Person {
    private _firstName: string;
    private _lastName: string;
    private _age: number;

    constructor(firstName: string, lastName: string, age: number) {
        this._firstName = firstName;
        this._lastName = lastName;
        this._age = age;
    }

    public get firstName(): string {
        return this._firstName;
    }
    public set firstName(value: string) {
        this._firstName = value;
    }

    public get lastName(): string {
        return this._lastName;
    }
    public set lastName(value: string) {
        this._lastName = value;
    }

    public get age(): number {
        return this._age;
    }
    public set age(value: number) {
        this._age = value;
    }

    public getFullName(): string {
        return `${this._firstName} ${this._lastName}`;
    }

    public toString(): string {
        return `Person: {firstName: ${this._firstName}, lastName: ${this._lastName}, age: ${this._age}}`;
    }

    public greeting(): string {
        return `Hello, I am ${this.getFullName()}`;
    }
}

class Developer extends Person {
    private _language: string;

    constructor(firstName: string, lastName: string, age: number, language: string) {
        super(firstName, lastName, age);
        this._language = language;
    }

    // Overriding the parent method
    // thus activating polimorphism
    public greeting(): string {
        return `Hello, I am ${this.getFullName()}, I am a developer, and I know ${this._language}`;
    }
}

function massGreeting(people: Person[]): void {
    for (let i = 0; i < people.length; i++) {
        console.log(people[i].greeting());
    }
}

const p1 = new Person('Igor', 'Petrov', 25);
const d1 = new Developer('Sergey', 'Ivanov', 25, 'JavaScript');

// console.log(p1.greeting());
// console.log(d1.greeting());

const pp = [p1, d1];
massGreeting(pp);

// COMPOSITION
class Engine {
    start() {
        console.log('Engine started');
        console.log('Wroom! Wroom!');
    }
}
class Wheel {
    spin() {
        console.log('Wheel spinning');
    }
}

abstract class Vehicle {
    abstract drive(): void;
    stop() {
        console.log('Vehicle stopped');
    }
}

class Car extends Vehicle {
    private _engine: Engine;
    private _wheels: Wheel[];
    private _freshener?: Freshener;

    constructor(freshener?: Freshener) {
        super();
        // COMPOSITION -
        // - all internal objects are created
        // inside the constructor!
        this._engine = new Engine();
        this._wheels = [new Wheel(), new Wheel(), new Wheel(), new Wheel()];
        // AGGREGATION - assigning object parameter
        // to a private property. Now a completely independent
        // Freshener object instance is part of the Car.
        this._freshener = freshener;
    }

    drive() {
        this._engine.start();
        this._wheels.forEach((w) => {
            w.spin();
        });
    }
}

// AGGREGATION
class Freshener() {}
const f1 = new Freshener();

// AGGREGATION - passing an object as a parameter
const car1 = new Car(f1);
car1.drive();

interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
}


interface IUserRepo {
    get(id: string): IUser;
    filter(user: Partial<IUser>): IUser[];
    create(u: IUser): IUser;
    update(id: IUser['id'], u: Partial<IUser>): IUser;
}

class UserRepoPostgres implements IUserRepo {
    get(id: string): IUser {
        throw new Error('Method not implemented.');
    }
    filter(user: Partial<IUser>): IUser[] {
        return [
            {
                id: '1postgres',
                firstName: 'Igor',
                lastName: 'Petrov',
                age: 25
            }
        ];
    }
    create(u: IUser): IUser {
        throw new Error('Method not implemented.');
    }
    update(id: any, u: Partial<IUser>): IUser {
        throw new Error("Method not implemented.");
    }
}

class UserRepoMongo implements IUserRepo {
    get(id: string): IUser {
        throw new Error('Method not implemented.');
    }
    filter(user: Partial<IUser>): IUser[] {
        return [
            {
                id: '1mongo',
                firstName: 'Igor',
                lastName: 'Petrov',
                age: 25
            }
        ];
    }
    create(u: IUser): IUser {
        throw new Error('Method not implemented.');
    }
    update(id: any, u: Partial<IUser>): IUser {
        throw new Error("Method not implemented.");
    }
}

class UserService {
    private _userRepo: IUserRepo;

    constructor(userRepo: IUserRepo) {
        this._userRepo = userRepo;
    }

    filterUsersByAge(age: number) {
        return this._userRepo.filter({ age });
    }
}

class Database {
    private _url: string;
    private static _instance: Database;

    constructor(url: string) {
        if (Database._instance) {
            return Database._instance;
        }
        this._url = url;
        Database._instance = this;
    }

    get url() {
        return this._url;
    }
    set url(url: string) {
        this._url = url;
    }
}

const db1 = new Database('mongodb://localhost:27017');
const db2 = new Database('postgresql://localhost:5432');

console.log(db1.url);
console.log(db2.url);