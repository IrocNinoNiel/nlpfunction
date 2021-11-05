const { NlpManager } = require('node-nlp');

var category = ['allowance','scholarship','website'];
var faq =[
    {
        title:'allowance.when',
        category:'allowance',
        utterances:['When is the next allowance'],
        answer:'N/A'
    },
    {
        title:'allowance.how',
        category:'allowance',
        utterances:['How much is the allowance','How much is the allowance per month'],
        answer:'3500 per month'
    },
    {
        title:'allowance.get',
        category:'allowance',
        utterances:['How to get the allowance'],
        answer:'By visiting the near ATM Machine'
    },
    {
        title:'website.how',
        category:'website',
        utterances:['How to access website','What is the link for the website'],
        answer:'Visit this link http:localhost:5000'
    },
    {
        title:'scholarship.when',
        category:'scholarship',
        utterances:['when is the scholarship announcement','What is the link for the website'],
        answer:'Visit this link http:localhost:5000'
    }
]

// Words that is not a keyword
var stopwords = ['is','the']

const manager = new NlpManager({ languages: ['en'], forceNER: true });
const manager1 = new NlpManager({ languages: ['en'], forceNER: true });

nlpFunction('how much the allowance')

async function nlpFunction(text){
    category.forEach(e=>{
        manager.addDocument('en', e, e);
        manager.addAnswer('en', e, e);
    })
    
    await manager.train();
    manager.save();
    const response = await manager.process('en', text);
   
    if(response.answer == undefined){
        console.log('No Possible Answer found')
    }else{
        faq = faq.filter(e=>e.category == response.answer);
        faq.forEach(e=>{
            e.utterances = e.utterances.map(u=>u.replace('allowance',''))
            stopwords.forEach(s=>{
                e.utterances = e.utterances.map(u=>u.replace(s,''))
            })

            console.log(e.utterances);
            e.utterances.forEach(u=>{
                manager1.addDocument('en', u, e.title);
                manager1.addAnswer('en', e.title, e.answer);
            })
        })

        await manager1.train();
        manager1.save();

        const response1 = await manager1.process('en', text);

        if(response1.answer == undefined){
            console.log(`The phrase ${response.answer} is very vague`)
        }else{
            console.log(response1.answer);
        }
    }
}