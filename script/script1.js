let nextPageURL = '';
let currentID = '1';
let maxPagesNumber = 0;
let step = 0;


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
			let abilityName = document.createElement('span');
			const name = arr[i][0] + ":      ";
			const textName = document.createTextNode(name);			
			abilityName.append(textName);
			abilityName.style.fontWeight = "bold";
			abilityLi.append(abilityName);
			let abilityText = arr[i][1] + ";";
			let text = document.createTextNode(abilityText);
			abilityLi.append(text);
			ul.append(abilityLi);
		};
		newLi.append(ul);
		return newLi;
	}
}

function drowDot(){
	let newDot = document.createElement('span');
	document.getElementById('dots').append(newDot);	
	newDot.classList.add('dot');
	const className = 'dot' + currentID;
	newDot.classList.add(className);	
};

function changeDotColor(color){
	const dotClassName = '.dot' + currentID;	
	let dot = document.querySelector(dotClassName);
	dot.style.backgroundColor = color;
};

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
		for(let i=0; i<step; i++ ){
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
		let arrAbilities = arr.map(arr => arr.abilities);		
		let tempAbilUrls = [];
		for (let j=0; j<arrAbilities.length; j++){
			let tempArr = arrAbilities[j];
			tempArrPokemons[j].setAbilitiesNumber(tempArr.length);			
			let tempAbilArr = tempArr.map(tempArr => tempArr.ability);			
			tempAbilNames = tempAbilNames.concat(tempAbilArr.map(tempAbilArr => tempAbilArr.name));			
			tempAbilUrls = tempAbilUrls.concat(tempAbilArr.map(tempAbilArr => tempAbilArr.url));			
		};		
		let arrPromises = [];
		for(let i=0; i<tempAbilUrls.length; i++){
		 	arrPromises.push(getServersData(tempAbilUrls[i]));		
		};		
		return Promise.all(arrPromises);
	})
	.then(function(data){
		let arrEffects = data.map(data => data.effect_entries[0]["effect"]);		
		let next = 0;
		for( let i=0; i<step; i++){
			let abilities = [];
			let numberAbilities = tempArrPokemons[i].getAbilitiesNumber();
			for(j=0; j<numberAbilities; j++){
				let ability = [tempAbilNames[next], arrEffects[next]];
				abilities.push(ability);
				next++; 
			};			
			tempArrPokemons[i].setAbilities(abilities);					
		};		
		let divList = document.createElement('div');
		divList.id = currentID;
		for (let i=0; i<tempArrPokemons.length; i++){
			const newUl = tempArrPokemons[i].createLiElement();
			divList.append(newUl);
		};
		maxPagesNumber +=1;
		document.getElementById('listContainer').append(divList);
		drowDot();	
	});
};

next.onclick = function(){	
	if (nextPageURL !== null) {
		document.getElementById(currentID).style.display = 'none';
		if (+currentID < maxPagesNumber){
			changeDotColor("#bbb");
			location.hash = changeCurrentID(1);
			document.getElementById(currentID).style.display = 'block';
			changeDotColor("#2eb8b8");
		} else {
			changeDotColor("#bbb");
			location.hash = changeCurrentID(1);			
			loadList(nextPageURL);
		}
	} else {
		if (+currentID < maxPagesNumber){
			changeDotColor("#bbb");
			document.getElementById(currentID).style.display = 'none';
			location.hash = changeCurrentID(1);
			document.getElementById(currentID).style.display = 'block';
			changeDotColor("#2eb8b8");
		};  
	};
};

previous.onclick = function(){
	if (+currentID > 1) {
		document.getElementById(currentID).style.display = 'none';
		changeDotColor("#bbb");
		location.hash = changeCurrentID(-1);
		document.getElementById(currentID).style.display = 'block';
		changeDotColor("#2eb8b8");
	}
};

let firstPageURL = "https://pokeapi.co/api/v2/pokemon/";
loadList(firstPageURL);
location.hash = currentID;
