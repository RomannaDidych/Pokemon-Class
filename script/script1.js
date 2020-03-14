let nextPageURL = '';
let arrPokemons = [];
let tempArrPokemons = [];
let tempAbilNames = [];

let step = 0;
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
	}
	//Pokemon methods
	setAbilitiesNumber(number){
		this.abilNumber = number;
	}

	getAbilitiesNumber(){
		return this.abilNumber;
	}

	setAbilities(array){
		this.abilities = array;
	}

	getAbilities(){
		return this.abilities;
	}
}

function getAllData(url){
	let loadPokemonsList = getServersData(url);
	loadPokemonsList
	.then(function(value){
		nextPageURL = value.next;
		let temp = value.results;
		step = temp.length;
		let arrNames = temp.map(temp => temp.name);				
		let arrUrls = temp.map(temp => temp.url);		
		for(let i=0+index; i<temp.length; i++ ){
			let pokemon = new Pokemon(arrNames[i], arrUrls[i]);			
			tempArrPokemons.push(pokemon);
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
		//console.log(arrAbilities);
		let tempAbilUrls = [];
		for (let j=0; j<arrAbilities.length; j++){
			let tempArr = arrAbilities[j];
			tempArrPokemons[j].setAbilitiesNumber(tempArr.length);
			//console.log(tempArrPokemons[j].getAbilitiesNumber()); 
			let tempAbilArr = tempArr.map(tempArr => tempArr.ability);
			//console.log(tempAbilArr);
			//let names = tempAbilArr.map(tempAbilArr => tempAbilArr.name);
			tempAbilNames = tempAbilNames.concat(tempAbilArr.map(tempAbilArr => tempAbilArr.name));
			//let urls = tempAbilArr.map(tempAbilArr => tempAbilArr.url);
			tempAbilUrls = tempAbilUrls.concat(tempAbilArr.map(tempAbilArr => tempAbilArr.url));
			//console.log(names);
			//console.log(urls);
		};
		//console.log(tempAbilNames);
		//console.log(tempAbilUrls);
		let arrPromises = [];
		for(let i=0; i<tempAbilUrls.length; i++){
		 	arrPromises.push(getServersData(tempAbilUrls[i]));		
		};		
		return Promise.all(arrPromises);
	})
	.then(function(data){
		let arrEffects = data.map(data => data.effect_entries[0]["effect"]);
		//console.log(arrEffects);
		let next = 0;
		for( let i=0; i<step; i++){
			let abilities = [];
			let numberAbilities = tempArrPokemons[i].getAbilitiesNumber();
			for(j=0; j<numberAbilities; j++){
				let ability = [tempAbilNames[next], arrEffects[next]];
				abilities.push(ability);
				next++; 
			};
			//console.log(abilities);
			tempArrPokemons[i].setAbilities(abilities);
			console.log("Pokemons " + tempArrPokemons[i].name + " abilities: ");
			console.log(tempArrPokemons[i].getAbilities());			
		};		
	});
};	


let firstPageURL = "https://pokeapi.co/api/v2/pokemon/";
getAllData(firstPageURL);