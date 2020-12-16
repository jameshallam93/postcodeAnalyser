/* A short script to check all postcodes in a given area, and return a formatted list
of postcodes in which we currently have no members

---------------------
Need to refactor a lot of variables for clarity
---------------------
- Add function which returns all postcodes we do cover
- Allow for broader searching, i.e. OX14 7B/OX14 7
- Return frequency of hits

*/


const fs = require("fs")
//data is our members info
const data = fs.readFileSync("\members.csv", "utf-8")
//codes to check are all postcodes around the area to mark off against
const rawCodesToCheck = fs.readFileSync("\abingdonPostcodes.csv", "utf-8")
const codesToCheck = rawCodesToCheck.split(",")

let postcodeSet = []

//formats postcodes from codestocheck and adds to a new array, postcode set
const formatCodes = () =>{
    for (let i = 0; i < codesToCheck.length; i++){
        postcodeSet.push(codesToCheck[i])
    }
    return Object.values(postcodeSet)
}




const rows = data.split(",")

let postcodes = []
//takes data from every third collum - relies on data arriving in same format every time
//should change to find "postcode" heading and use that collum instead
const getPostcodes = () =>{

    for (let i = 0; i < rows.length ; i++){
        if ((i-3)%9 == 0){
            postcodes.push(rows[i])
        }
    }
}
getPostcodes()
postcodeSet = formatCodes()
//sets seemed like the easiest way to cross reference postcodes between datasets
//and ensured that the script wouldn't return duplicates
const uniqueCodes = new Set()
const uniqueCodesToCheck = new Set()

//should find a way to remove whitespace - why isn't .replace(" ", "") working?
postcodes.map(code =>{
     uniqueCodes.add(code.toUpperCase())})

postcodeSet.map(code =>{
    uniqueCodesToCheck.add(code.value)
})


let unreachedPostcodes = []
//a map that adds postcodes that exist in the area but that we don't have members in to unreachedPostcodes
postcodeSet.map(code =>{
    if (!(uniqueCodes.has(code))){ 
        unreachedPostcodes.push(code)
    }
}
)
const returnStats = () =>{
    console.log(`number of postcodes in area ${codesToCheck.length}`);

    console.log(`test postcodes: ${codesToCheck[0]} \n ${codesToCheck[150]}`);

    console.log(`number of member postcodes: ${postcodes.length}`)

    console.log(`number of unique member postcodes: ${uniqueCodes.size}`);

    console.log(`number of unreached postcodes in area:${unreachedPostcodes.length}`)
}

//formats the unreached postcodes to be one per line - needed to upload to:
//https://www.mapcustomizer.com/
let uploadData = ""
unreachedPostcodes.map(code =>{
    uploadData = uploadData + code +"\n"
})

returnStats()
fs.writeFileSync("unreached", uploadData)


