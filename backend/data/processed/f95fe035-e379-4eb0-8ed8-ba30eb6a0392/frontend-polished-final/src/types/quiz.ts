export interface Question {

    id:number;

    question:string;

    optionA:string;

    optionB:string;

    optionC:string;

    optionD:string;

}

export interface Quiz{

    id:number;

    title:string;

    description:string;

    courseTitle:string;

    questions:Question[];

}