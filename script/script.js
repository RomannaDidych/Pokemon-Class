let nextPageURL = '';
//let arrNames = [];
//let arrUrls = [];
let arrPokemons = [];
let step = 20; 
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
	//methods

	//returns array abilities (arrAbil) for this pokemon: [ ["name1","short effect1"], ["name2","short effect2"],...]
	getabilities() {
		let arrAbil = [];
		let arrAbilNames = [];		
		let loadPokemonsData = getServersData(this.url); 
		loadPokemonsData.then(function(data){			
			let tempArr = data.abilities;
			let arrOnePokemonsAbil = tempArr.map(tempArr => tempArr.ability);
			arrAbilNames = arrOnePokemonsAbil.map(arrOnePokemonsAbil => arrOnePokemonsAbil.name);
			//console.log(arrAbilNames);
			let tempArrURL = arrOnePokemonsAbil.map(arrOnePokemonsAbil => arrOnePokemonsAbil.url);
			let arrPromises = [];
			for(let item of tempArrURL){
			 	arrPromises.push(getServersData(item));		
			};			
			return Promise.all(arrPromises);
		}).then(function(abilityData){
			//console.log(abilityData);
			let tempArrEffects = abilityData.map(abilityData => abilityData.effect_entries[0]["effect"]);
			//console.log(tempArrEffects);
			for(let i=0; i < tempArrEffects.length; i++ ){
				let temp = [];
				temp[0] = arrAbilNames[i];
				temp[1] = tempArrEffects[i];				
				arrAbil.push(temp);			
			};
			//console.log(this); this undefined					
		});		
		return arrAbil;		
	}
}



			/*for(let i=0; i<arrOnePokemonsAbil.length;i++){
				let oneAbility = [];
				oneAbility[0] = arrOnePokemonsAbil[i].name;
				getServersData(arrOnePokemonsAbil[i].url).then(function(value){					
					oneAbility[1] = value.effect_entries[0]["short_effect"];
				});
				
				arrAbil.push(oneAbility);
			};
			return arrAbil;
				
		});		
	}*/

	//set abilities(){}

	//create li - information about this pokemon for show 
	/*createLiElement(arr){
		let li = document.createElement('li');
		let h2 = document.createElement('h2');
		h2.innerHTML = this.name;		
		li.append(h2);
	}*/
	
/*};*/

/*function createPokemonsList(url){
	let loadPokemonsList = getServersData(url);
	loadPokemonsList.then(function(value){
		nextPageURL = value.next;
		let temp = value.results;
		let arrNames = temp.map(temp => temp.name);				
		let arrUrls = temp.map(temp => temp.url);		
		for(let i=0; i<temp.length; i++ ){
			let pokemon = new Pokemon(arrNames[i], arrUrls[i]);			
			arrPokemons.push(pokemon);
			let abilities = pokemon.getPokemonAbilities();
			console.log(abilities[0]);
		};*/
		//console.log(arrPokemons);
		//console.log(arrPokemons[0]);
		//let abilities1 = arrPokemons[0].getPokemonAbilities(arrPokemons[0][1]);
		//console.log(abilities1);
/*	});
};*/

function getAllData(url){
	let loadPokemonsList = getServersData(url);
	loadPokemonsList
	.then(function(value){
		nextPageURL = value.next;
		let temp = value.results;
		let arrNames = temp.map(temp => temp.name);				
		let arrUrls = temp.map(temp => temp.url);
		for(let i=0; i<temp.length; i++ ){
			let pokemon = new Pokemon(arrNames[i], arrUrls[i]);			
			arrPokemons.push(pokemon);
		};
		//let ab = arrPokemons[0].getabilities();
		console.log(arrPokemons[0].getabilities().length);
		//console.log("first pokemons abilities: " + arrPokemons[0].getabilities());

		/*return new Promise(function(resolve, reject){
			resolve();
		});*/
	})
	.then(function(){
		console.log("I am here");
		/*for(let i=0; i<arrPokemons; i++){
			console.log(arrPokemons[i].abilities);
		}*/

	});
};	
		/*let arrPromises = [];
		for(let i=0; i<arrUrls.length; i++){
		 	arrPromises.push(getServersData(arrUrls[i]));		
		};
		//console.log(arrPromises);
		return Promise.all(arrPromises);
	})
	.then(function(resultArr){
		console.log(resultArr);
		let arrAbilities = resultArr.map(resultArr => resultArr.abilities);
		console.log(arrAbilities);
	});
		
};*/

let firstPageURL = "https://pokeapi.co/api/v2/pokemon/";
getAllData(firstPageURL);

//console.log(arrPokemons[0]);
//let abilities1 = arrPokemons[0].getArrayAbilities(arrPokemons[0][1]);
//console.log(abilities1);