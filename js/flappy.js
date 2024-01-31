const available_tubes = []
const tubes_passed_ids = []
const bird = document.querySelector('.passaro')
const score_e = document.querySelector('.score')
var score = 0
var ids = 0


function random_tubes_calc(top_tube_e, bottom_tube_e) {
    let rand = Math.floor(Math.random() * (300 - 70)) + 70

    top_tube_e.style.height = `${rand}px`
    bottom_tube_e.style.height = `${496 - rand - 122}px`

    return [top_tube_e, bottom_tube_e]
}

function generates_tubes() {
    const new_div_tube = document.createElement('div')
    let new_div_tube_top = document.createElement('div')
    let new_div_tube_bottom = document.createElement('div')
    //let new_div_base_tube1 = document.createElement('div')
    //let new_div_base_tube2 = document.createElement('div')
    
    //new_div_base_tube1.classList.add('base-tube')
    //new_div_base_tube2.classList.add('base-tube')
    //new_div_base_tube2.style.marginTop = '120px'
    //new_div_base_tube2.style.marginBottom = '-30px'
    

    new_div_tube.setAttribute('id', `${ids}`)
    ids++

    new_div_tube.classList.add('tubo-area')
    new_div_tube_top.classList.add('tubo-top')
    new_div_tube_bottom.classList.add('tubo-bottom')
    
    //new_div_tube.appendChild(new_div_base_tube1)
    
    //new_div_tube.appendChild(new_div_base_tube2)
    new_div_tube.appendChild(new_div_tube_top)
    new_div_tube.appendChild(new_div_tube_bottom)

    
    [new_div_tube_top, new_div_tube_bottom] = random_tubes_calc(new_div_tube_top, new_div_tube_bottom)

    available_tubes.push(new_div_tube)
    document.querySelector('[wm-flappy]').appendChild(new_div_tube)
}

function slider() {
    for (let tube of available_tubes) {
        let left_pos = tube.getBoundingClientRect().left
        tube.style.left = `${left_pos - 1}px`
    }
    if(available_tubes[0].getBoundingClientRect().left < 360)
        available_tubes.shift()
}

function flying_bird() {
    let top = bird.getBoundingClientRect().top
    if(top > 115)
        bird.style.top = `${top - 4}px`
    collider()
}

function falling_bird() {
    let top = bird.getBoundingClientRect().top
    if(top < 550)
        bird.style.top = `${top + 4}px`
}

function collider() {
    let bird_pos = bird.getBoundingClientRect()
    for (let tube of available_tubes) {
        let top_tube_pos = tube.children[0].getBoundingClientRect()
        let bottom_tube_pos = tube.children[1].getBoundingClientRect()
        if(tube.getBoundingClientRect().left <= (bird_pos.left + bird_pos.width)){
            if((tube.getBoundingClientRect().left + tube.getBoundingClientRect().width) >= bird_pos.left) {
                if((top_tube_pos.top + top_tube_pos.height) >= bird_pos.top) {
                    stopper()
                }
                else if((bottom_tube_pos.top) <= (bird_pos.top + bird_pos.height)) {
                    stopper()
                }
            }
            else {
                score_updater(tube.id)
            }
         
        }
    }
}

function stopper() {
    clearInterval(interval_falling_bird)
    clearInterval(interval_flying_bird)
    clearInterval(interval_generator)
    clearInterval(interval_slider)
    clearInterval(interval_collider)
    document.body.onmousedown = e => e.preventDefault();       
    document.body.onmouseup = e => e.preventDefault();
    game_over()
}

function game_over() {
    let game_over_div = document.createElement('div')
    let p_phrase = document.createElement('p')
    let p_score = document.createElement('p')
    let a = document.createElement('a')
    let restart_button = document.createElement('button')
    
    p_phrase.innerHTML = "Game Over"
    p_phrase.style.fontSize = '50px'
    p_score.innerHTML = `score: ${score}`
    restart_button.innerHTML = 'restart'
    restart_button.classList.add('restart-button')
    game_over_div.classList.add('game-over')
    a.setAttribute('href', `${window.location.href}`)
    
    
    a.appendChild(restart_button)
    game_over_div.appendChild(p_phrase)
    game_over_div.appendChild(p_score)
    game_over_div.appendChild(a)
    document.body.appendChild(game_over_div)
}
function score_updater(tube_id) {
    if(!tubes_passed_ids.includes(tube_id)) {
        score++
        score_e.innerHTML = score
        tubes_passed_ids.push(tube_id)
    }
}
function sky_change() {
    let img = document.querySelector('.cloud-sky')
    console.log(score % 5, score % 10)
    if(img.src === "./cloud-sky.jpeg" && score % 5 == 0)
        img.src = "./night-sky.avif"
    else if(img.src === "./night-sky.avif" && score % 10 == 0)
        img.src = "./cloud-sky.jpeg"
}

generates_tubes()
const interval_generator = setInterval(generates_tubes, 1800)
const interval_slider = setInterval(slider, 5)
var interval_falling_bird = setInterval(falling_bird, 20)
var interval_flying_bird
var interval_collider = setInterval(collider, 30)
var interval_background_changer = setInterval(sky_change, 500)

document.body.onmousedown = function () {
    clearInterval(interval_falling_bird)
    interval_flying_bird = setInterval(flying_bird, 20)
}
document.body.onmouseup = function () {
    clearInterval(interval_flying_bird)
    interval_falling_bird = setInterval(falling_bird, 20)
}