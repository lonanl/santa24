let iKey = document.getElementById('iKey')
let $bShow = document.getElementById('bShow')
let $table = document.getElementById('presenters')
let $tbody = $table.querySelector('tbody')
let peoples = [
	'Света А (Мама)',
	'Миша А (Папа)',
	'Андрей',
	'Николка',
	'Маша А (Пух)',
	'Леша',
	'Ваня',
	'Настя А',
	'Таня Е (Мама)',
	'Миша Е (Папа)',
	'Костя',
	'Саша Е',
	'Маша (Андрюшкина)',
	'Настя (Николкина)',
	'Бабушка',
	'Саша Б',
	'Влад',
	'Тимошка'
]

//Исключения [Даритель, Получатель]
let exceptions = [
	["Миша А (Папа)", "Света А (Мама)"],
	["Бабушка", "Миша А (Папа)"],
	["Бабушка", "Света А (Мама)"], 
	["Бабушка", "Леша"], 
	["Андрей", "Маша (Андрюшкина)"], 
	["Андрей", "Тимошка"],
	 ["Маша (Андрюшкина)", "Андрей"], 
	 ["Маша (Андрюшкина)", "Тимошка"], 
	 ["Тимошка", "Маша (Андрюшкина)"], 
	 ["Тимошка", "Андрей"], 
	 ["Настя (Николкина)", "Николка"], 
	 ["Николка", "Настя (Николкина)"], 
	 ["Влад", "Маша А (Пух)"], 
	 ["Маша А (Пух)", "Влад"], 
	 ["Таня Е (Мама)", "Миша Е (Папа)"], 
	 ["Миша Е (Папа)", "Таня Е (Мама)"]]

const count = peoples.length
let pre = [], rec = []

let previousValue = ''
// iKey.value = ''
onKeyInput(iKey)
function onKeyInput(iKey) {
	if (isNaN(Number(iKey.value.at(-1)))) {
		iKey.value = iKey.value === '' ? '' : previousValue
		console.log(iKey.value)
	}
	previousValue = iKey.value
	let val = iKey.value
	val = val !== '' ? Number(iKey.value) : NaN
	$bShow.disabled = isNaN(val);
}

function generatePresenters() {
	$tbody.innerHTML = ''
	$bShow.disabled = true
	//объект псведослучайных чисел
	let generator = new LinearCongruentialGenerator(
		(Math.floor(Math.abs(Number(iKey.value))) % 512 + 512) * 437, //тут мы получаем ключ из поля ввода
		1664525,
		1013904223,
		4294967296)
	//начальные списки отправителей и получаетелей
	let presenters = [...peoples]
	let receivers = [...peoples]

	//Запутывание списков (случайные перестановки по ключу)
	for (let i = 0; i < count; i++) {
		let a = generator.randIntBetween(0, count - 1) //генерация двух случайных чисел от нуля до количества
		let b = generator.randIntBetween(0, count - 1)
		presenters[a] = [presenters[b], presenters[b] = presenters[a]][0]; //перестановка отправителей
		receivers[a] = [receivers[b], receivers[b] = receivers[a]][0]; //перест получателей
		console.log(a, b)
	}

	let iterations = 0
	//продолжение перестановок до тех пор пока не пройдет проверку
	while (true) {
		let swapping = check(presenters, receivers) //получение отправителя, который не может дарить подарок самому себе или исключению
		console.log(presenters, swapping)
		console.log(receivers, swapping)
		if (swapping === -1) break //если таких нет то завершаем
		else { //если есть переставляем его со случайным человеком
			let b = generator.randIntBetween(0, count - 1)
			presenters[swapping] = [presenters[b], presenters[b] = presenters[swapping]][0];
		}
		iterations++
	}
	console.log(iterations)

	//Добавление списка в таблицу
	for (let i = 0; i < count; i++) {
		let $tr = document.createElement('tr')
		let $tdPresenter = document.createElement('td')
		$tdPresenter.innerText = presenters[i]
		// $tdPresenter.innerText = presenters[i]+' →'
		// $tdPresenter.classList.add('text-end')
		let $tdReceiver = document.createElement('td')
		$tdReceiver.innerText = receivers[i]
		$tr.append($tdPresenter, $tdReceiver)
		$tbody.appendChild($tr)
	}
	//Включение отображения таблицы
	$table.style.display = 'block'
	pre = [...presenters]
	rec = [...receivers]
}

function check(presenters, receivers) {
	for (let i = 0; i < count; i++) {
		if (presenters[i] === receivers[i])
			return i
		if (receivers[presenters.indexOf(receivers[i])] === presenters[i])
			return i
		for (let exception of exceptions) {
			if (exception[0] === presenters[i] && exception[1] === receivers[i])
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