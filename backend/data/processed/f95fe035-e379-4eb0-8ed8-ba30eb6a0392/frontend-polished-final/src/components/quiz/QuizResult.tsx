interface Props{

    score:number;

    total:number;

}

export default function QuizResult({

    score,

    total

}:Props){

    return(

        <div className="rounded-xl bg-green-100 p-8 text-center">

            <h1 className="text-4xl font-bold">

                Quiz Completed 🎉

            </h1>

            <p className="mt-5 text-2xl">

                Score

            </p>

            <h2 className="text-5xl font-bold mt-3">

                {score} / {total}

            </h2>

        </div>

    )

}