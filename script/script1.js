let nextPageURL = '';
let arrPokemons = [];
const step = 20;
let index = 0; 
let numberOnPage = 0;


function getServersData(url){
	return new Promise(function(resolve,reject){
				$.get(url, function(data,status){
					if(status === 'success'){
						 resolve(data);
					} else {
						 reject(new Error("Whoops!"));
					}
				});
			});
};



class Pokemon{
	constructor(name,url){
		this.name = name
		this.url = url
		this.abilNumber = 0
	}
}

function getAllData(url){
	let loadPokemonsList = getServersData(url);
	loadPokemonsList
	.then(function(value){
		nextPageURL = value.next;
		let temp = value.results;
		let arrNames = temp.map(temp => temp.name);				
		let arrUrls = temp.map(temp => temp.url);
		for(let i=0+index; i<temp.length; i++ ){
			let pokemon = new Pokemon(arrNames[i], arrUrls[i]);			
			arrPokemons.push(pokemon);
		};

		let arrPromises = [];
		for(let i=0; i<arrUrls.length; i++){
		 	arrPromises.push(getServersData(arrUrls[i]));		
		};		
		return Promise.all(arrPromises);		
	})
	.then(function(arr){
		//console.log(arr);
		let arrAbilities = arr.map(arr => arr.abilities);
		console.log(arrAbilities);
		for (let j=0; j<arrAbilities.length; j++){
			let tempArr = arrAbilities[j];
			let tempAbilArr = tempArr.map(tempArr => tempArr.ability);
			//console.log(tempAbilArr);
			let names = tempAbilArr.map(tempAbilArr => tempAbilArr.name);
			let urls = tempAbilArr.map(tempAbilArr => tempAbilArr.url);
			console.log(names);
			console.log(urls);

		};
		


	/*async function processArr(arr){
			let k = -1;
			let valueArr = [];
			for(item of arr){
				k += 1;
				valueArr[k] = await getServersData(item);
			}
			return valueArr;
		}

		for (let i= 0+index; i<arrAbilities.length; i++){

		}*/
		

	});
};	


let firstPageURL = "https://pokeapi.co/api/v2/pokemon/";
getAllData(firstPageURL);