let iKey = document.getElementById('iKey')
let $bShow = document.getElementById('bShow')
let $table = document.getElementById('presenters')
let peoples = ['Леша', 'Ваня', 'Маша', 'Настя','Мама','Папа']
let exceptions = [["Мама","Папа"],["Мама","Маша"],["Мама","Леша"],["Мама","Настя"],["Леша","Маша"],["Леша","Папа"],["Леша","Мама"]] //Исключения [Даритель, Получатель]
const count = peoples.length

onKeyInput(iKey)

function onKeyInput(iKey) {
	let val = iKey.value
	val = val !== '' ? Number(iKey.value) : NaN
	if (!isNaN(val) && 0 <= val && val <= 512) {
		console.log('123', val, typeof val, !isNaN(val))
		$bShow.disabled = false
	}
	else {
		$bShow.disabled = true
	}
}

function generatePresenters() {
	$bShow.disabled = true
	//объект псведослучайных чисел
	let generator = new LinearCongruentialGenerator(
		((Number(iKey.value))%512  + 512)* 437,
		1664525,
		1013904223,
		4294967296)
	//начальные списки отправителей и получаетелей
	let presenters = [...peoples]
	let receivers = [...peoples]
	
	//Запутывание списков (случайные перестановки по ключу)
	for (let i = 0; i < count; i ++) {
		let a = generator.randIntBetween(0, count-1) //генерация двух случайных чисел от нуля до количества
		let b = generator.randIntBetween(0, count-1)
		presenters[a] = [presenters[b], presenters[b] = presenters[a]][0]; //перестановка отправителей
		receivers[a] = [receivers[b], receivers[b] = receivers[a]][0]; //перест получателей
		console.log(a,b)
	}
	
	//продолжение перестановок до тех пор пока не пройдет проверку
	while(true){
		let swapping = check(presenters,receivers) //получение отправителя, который не может дарить подарок самому себе или исключению
		console.log(presenters, swapping)
		console.log(receivers, swapping)
		if(swapping===-1) break //если таких нет то завершаем
		else{ //если есть переставляем его со случайным человеком
			let b = generator.randIntBetween(0, count-1)
			presenters[swapping] = [presenters[b], presenters[b] = presenters[swapping]][0];
		}
	}
	
	//Добавление списка в таблицу
	for (let i = 0; i < count; i ++) {
		let $tr = document.createElement('tr')
		let $tdPresenter = document.createElement('td')
		$tdPresenter.innerText = presenters[i]+' →'
		$tdPresenter.classList.add('text-end')
		let $tdReceiver = document.createElement('td')
		$tdReceiver.innerText = receivers[i]
		$tr.append($tdPresenter, $tdReceiver)
		$table.querySelector('tbody').appendChild($tr)
	}
	//Включение отображения таблицы
	$table.style.display = 'block'
}

function check(presenters, receivers) {
	for (let i = 0; i < count; i ++) {
		if(presenters[i]===receivers[i])
			return i
		for (let exception of exceptions) {
			if(exception[0]===presenters[i] && exception[1]===receivers[i])
				return i
		}
	}
	return -1
}

class LinearCongruentialGenerator {
	#a;
	#c;
	#m;
	#seed;
	
	constructor(seed, a, c, m) {
		this.#seed = seed;
		this.#a = a;
		this.#c = c;
		this.#m = m;
	}
	
	next() {
		this.#seed = (this.#a * this.#seed + this.#c) % this.#m;
		return this.#seed / this.#m;
	}
	
	randIntBetween(min, max) {
		return Math.floor((max - min) * this.next() + min);
	}
}