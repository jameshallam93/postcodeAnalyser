/* A short script to check all postcodes in a given area, and return a formatted list
of postcodes in which we currently have no members

---------------------
Need to refactor a lot of variables for clarity
Might be sensible to function the map functions where applicable
---------------------
- Add function which returns all postcodes we do cover
- Allow for broader searching, i.e. OX14 7B/OX14 7 ******(DONE)*******
- Return frequency of hits

*/


const fs = require("fs")

//data is our members info
const memberData = fs.readFileSync("\members.csv", "utf-8")

//codes to check are all postcodes around the area to mark off against
const rawCodesToCheck = fs.readFileSync("\abingdonPostcodes.csv", "utf-8")
const codesToCheck = rawCodesToCheck.split(",")

let postcodeSet = []

//formats postcodes from codestocheck and adds to a new array, postcode set
const formatCodes = () =>{
    for (let i = 0; i < codesToCheck.length; i++){
        postcodeSet.push(codesToCheck[i])
    }
    postcodeSet =  Object.values(postcodeSet)
}




const rows = memberData.split(",")

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
formatCodes()
//sets seemed like the easiest way to cross reference postcodes between datasets
//and ensured that the script wouldn't return duplicates
let uniqueCodes = new Set()
let uniqueCodesToCheck = new Set()

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
    
    console.log(`test broad postcode: ${broadUploadData.substr(0, 7)}`)

    console.log(`broad unreached postcodes: ${shortenedPostcodes.size} `)
}

//formats the unreached postcodes to be one per line - needed to upload to:
//https://www.mapcustomizer.com/
let uploadData = ""
unreachedPostcodes.map(code =>{
    uploadData = uploadData + code +"\n"
})

//map to remove last character from postcodes.
//repeat process to create new list of unreached shortened postcodes
//return said list as a csv file for use on doogal.co.uk
const shortenedPostcodes = new Set()

postcodeSet.map(code =>{
    //creates new string starting from index 0 and ending index n-1
    code = code.substring(0, code.length -1)
    shortenedPostcodes.add(code)
})
//broad upload data refers to broader search, i.e. shorter postcode
let broadUploadData = ""

shortenedPostcodes.forEach(code =>{
    broadUploadData = broadUploadData + code + ","
})

returnStats()
fs.writeFileSync("unreached", uploadData)
fs.writeFileSync("broadUnreached", broadUploadData)