namespace Eisdealer {
    export interface IceCream {
        flavor: string;
        price: number;
    }

    export let data: IceCream[] = [
        { flavor: "chocolate", price: 2 },
        { flavor: "strawberry", price: 2 },
        { flavor: "vanille", price: 2 },
        { flavor: "pistacchio", price: 2 }
    ];
}
