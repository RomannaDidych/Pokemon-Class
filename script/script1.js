let nextPageURL = '';
/*let tempArrPokemons = [];
let tempAbilNames = [];*/

let currentID = '1';
let maxPagesNumber = 0;

let step = 0;
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

function changeCurrentID(arg){
	let ID = Number(currentID) + arg;
	currentID = String(ID);
	return currentID;
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

	createLiElement(){
		let newLi = document.createElement('li');
		let h2 = document.createElement('h2');
		h2.innerHTML = this.name;		
		newLi.append(h2);
		let ul = document.createElement('ul');
		let arr = this.abilities;
		for(let i=0; i<arr.length; i++){
			let abilityLi = document.createElement('li');
			let abilityText = arr[i][0] + ":      " + arr[i][1] + ";";
			let text = document.createTextNode(abilityText);
			abilityLi.append(text);
			ul.append(abilityLi);
		};
		newLi.append(ul);
		return newLi;
	}
}

function loadList(url){
	let tempArrPokemons = [];
	let tempAbilNames = [];
	let loadPokemonsList = getServersData(url);
	loadPokemonsList
	.then(function(value){
		nextPageURL = value.next;
		let temp = value.results;
		step = temp.length;
		let arrNames = temp.map(temp => temp.name);				
		let arrUrls = temp.map(temp => temp.url);		
		for(let i=0; i<temp.length; i++ ){
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
			//console.log("Pokemons " + tempArrPokemons[i].name + " abilities: ");
			//console.log(tempArrPokemons[i].getAbilities());			
		};
		//here
		let divList = document.createElement('div');
		divList.id = currentID;
		for (let i=0; i<tempArrPokemons.length; i++){
			const newUl = tempArrPokemons[i].createLiElement();
			divList.append(newUl);
		};
		maxPagesNumber +=1;
		document.getElementById('listContainer').append(divList);	
	});
};

next.onclick = function(){	
	if (nextPageURL !== null) {
		document.getElementById(currentID).style.display = 'none';
		if (+currentID < maxPagesNumber){
			location.hash = changeCurrentID(1);
			document.getElementById(currentID).style.display = 'block';
		} else {
			location.hash = changeCurrentID(1);			
			loadList(nextPageURL);
		}
	} else {
		if (+currentID < maxPagesNumber){
			document.getElementById(currentID).style.display = 'none';
			location.hash = changeCurrentID(1);
			document.getElementById(currentID).style.display = 'block';
		};  
	};
};

previous.onclick = function(){
	if (+currentID > 1) {
		document.getElementById(currentID).style.display = 'none';
		location.hash = changeCurrentID(-1);
		document.getElementById(currentID).style.display = 'block';
	}
};

let firstPageURL = "https://pokeapi.co/api/v2/pokemon/";

loadList(firstPageURL);
location.hash = currentID;
