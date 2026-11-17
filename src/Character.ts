import type { Weapon } from './Weapon';

export abstract class Character{
    public readonly name: string;
    public readonly maxHealth: number;
    public readonly baseAttack: number;
    public readonly baseDefense: number;
    private _health: number;
    private _weapon: Weapon | null;

    public constructor (name: string, health: number, baseAttack: number, baseDefense: number){
        this.name = name;
        this.maxHealth = health;
        this._health = health;
        this.baseAttack = baseAttack;
        this.baseDefense = baseDefense;
        this._weapon = null;

        if (health <= 0) {
            throw new Error(`The health of ${name} must be strictly positive.`);
        }
    }

    public get health(): number{
        return this._health;
    }

    public abstract getAttack(): number

    public abstract canEquip(weapon: Weapon): boolean;

    protected getWeaponAttackBonus(): number {
        return this._weapon ? this._weapon.attackBonus : 0;
    }

    public isAlive(): boolean{
        return this._health > 0;
    }

    public describe(): string{
        const weapon = this._weapon ? this._weapon.name : 'none';
        return `${this.name} - health ${this.health} / ${this.maxHealth} - attack ${this.getAttack()} - defense ${this.baseDefense} - weapon ${weapon}`;
    }

    public equip(weapon: Weapon): void{
        if (!this.canEquip(weapon)) {
            throw new Error(`${this.name} cannot equip ${weapon.name}.`);
        }
    }

    public takeDamage(amount: number): void{
        this._health = Math.max(0, this._health - amount);
    }

    public heal(amount: number): void {
        this._health = Math.min(this.maxHealth, this._health + amount);
    }

    protected computeDamage(target: Character): number{
        return Math.max(0, this.getAttack() - target.baseDefense);
    }

    public attack(target: Character): number{
        if (!this.isAlive()){
            throw new Error(`${this.name} is KO and cannot attack.`);
        }

        if (target === this){
            throw new Error(`${this.name} cannot attack themselves.`);
        }

        if (!target.isAlive()){
            throw new Error(`${target.name} is already KO.`);
        }

        const damage = this.computeDamage(target);
        target.takeDamage(damage);
        
        console.log(`${this.name} hits ${target.name} for ${damage} damage (${target.name}: ${target.health}/${target.maxHealth}).`);

        if (!target.isAlive()){
            console.log(`${target.name} is KO!`);
        }

        return damage

    }
}