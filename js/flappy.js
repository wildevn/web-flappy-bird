class FlappyBirdGame {
    constructor(height, width) {
        // build the window here
        this.height = height
        this.width = width
        this.available_tubes = []
        this.tubes_passed_ids = []
        this.bird = document.querySelector('.bird')
        this.score_e = document.querySelector('.score')
        this.score = 0
        this.ids = 0
        //this.interval_mouse_flying_bird
        //this.interval_mouse_falling_bird
        //this.interval_touch_flying_bird
        //this.interval_touch_falling_bird
        
        this.bird.style.bottom = (this.width / 4).toString() + 'px'
        this.generates_tubes()
        this.interval_generator = setInterval(this.generates_tubes.bind(this), 1800)
        this.interval_slider = setInterval(this.slider.bind(this), 5)
        this.interval_collider = setInterval(this.collider.bind(this), 30)
        //var interval_background_changer = setInterval(sky_change, 500)

        document.body.onmousedown = this.desktop_mouse_starter.bind(this)
        document.body.addEventListener("touchstart", this.mobile_touch_starter.bind(this))
    }

    random_tubes_calc(top_tube_e, bottom_tube_e) {
        let rand = Math.floor(Math.random() * (400 - 100)) + 100
    
        top_tube_e.style.height = `${rand}px`
        // max height - rand number - 2 * border-tube height - 120 space between both
        bottom_tube_e.style.height = `${700 - rand - 215}px` 
    
        return [top_tube_e, bottom_tube_e]
    }

    generates_tubes() {
        let new_div_tube_area = document.createElement('div')
        let new_div_top_column = document.createElement('div')
        let new_div_bottom_column = document.createElement('div')
        let new_div_top_tube = document.createElement('div')
        let new_div_bottom_tube = document.createElement('div')
        let new_div_base_top_tube = document.createElement('div')
        let new_div_base_bottom_tube = document.createElement('div')
    
        new_div_tube_area.setAttribute('id', `${this.ids}`)
        this.ids++
        
        new_div_tube_area.classList.add('tube-area')
        new_div_tube_area.style.left = '99%';
        new_div_top_column.classList.add('column')
        new_div_bottom_column.classList.add('column')
        new_div_top_tube.classList.add('top-tube')
        new_div_bottom_tube.classList.add('bottom-tube')
        new_div_base_top_tube.classList.add('base-tube')
        new_div_base_bottom_tube.classList.add('base-tube')
        
        new_div_top_column.appendChild(new_div_top_tube)
        new_div_top_column.appendChild(new_div_base_top_tube)
        new_div_bottom_column.appendChild(new_div_base_bottom_tube)
        new_div_bottom_column.appendChild(new_div_bottom_tube)
        
        new_div_tube_area.appendChild(new_div_top_column)
        new_div_tube_area.appendChild(new_div_bottom_column)
        
        
        [new_div_top_tube, new_div_bottom_tube] = this.random_tubes_calc(new_div_top_tube, new_div_bottom_tube)
        
       this.available_tubes.push(new_div_tube_area)
       document.querySelector('[wm-flappy]').appendChild(new_div_tube_area)
    }

    slider() {
        for (let tube of this.available_tubes){
            tube.style.left = `${parseFloat(tube.style.left) - 0.1}%`
            if(parseFloat(this.available_tubes[0].style.left) < -10)
                this.available_tubes.shift()
        }
    }

    flying_bird() {
        let bottom = this.bird.style.bottom // mudar para window-size
        if(parseInt(bottom.split('px')[0]) < 635)
            this.bird.style.bottom = `${parseInt(bottom.split('px')[0]) + 12}px`
        else
            this.bird.style.bottom = '645px'
    }

    falling_bird() {
        let bottom = this.bird.style.bottom // mudar para window-size
        if(parseInt(bottom.split('px')[0]) > 15)
            this.bird.style.bottom = `${parseInt(bottom.split('px')[0]) - 12}px`
        else
            this.bird.style.bottom = '0px'
    }

    collider() {
        for (let tube of this.available_tubes) {
            let top_tube_pos = tube.children[0].getBoundingClientRect()
            let bottom_tube_pos = tube.children[1].getBoundingClientRect()

            if(tube.getBoundingClientRect().left <= (this.bird.getBoundingClientRect().left + this.bird.getBoundingClientRect().width)){
                if((tube.getBoundingClientRect().left + tube.getBoundingClientRect().width) >= this.bird.getBoundingClientRect().left) {
                    if((top_tube_pos.top + top_tube_pos.height) >= this.bird.getBoundingClientRect().top)
                        this.stopper()
                    else if((bottom_tube_pos.top) <= (this.bird.getBoundingClientRect().top + this.bird.getBoundingClientRect().height))
                        this.stopper()
                }
                else
                    this.score_updater(tube.id)
            }
        }
    }
    
    stopper() {
        clearInterval(this.interval_generator)
        clearInterval(this.interval_slider)
        clearInterval(this.interval_collider)
        if(navigator.userAgentData.plataform == 'Windows') {
            document.body.onmousedown = e => e.preventDefault();       
            document.body.onmouseup = e => e.preventDefault();
            clearInterval(this.interval_mouse_falling_bird)
            clearInterval(this.interval_mouse_flying_bird)
        }
        else {    
            clearInterval(this.interval_touch_falling_bird)
            clearInterval(this.interval_touch_flying_bird)
            document.body.removeEventListener("touchstart", this.touchstart)
            document.body.removeEventListener("touchend", this.touchend)
        }
        this.game_over()
    }

    game_over() {
        let game_over_div = document.createElement('div')
        let p_phrase = document.createElement('p')
        let p_score = document.createElement('p')
        let a = document.createElement('a')
        let restart_button = document.createElement('button')
        
        p_phrase.innerHTML = "Game Over"
        p_phrase.style.fontSize = '50px'
        p_score.innerHTML = `score: ${this.score}`
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

    score_updater(tube_id) {
        if(!this.tubes_passed_ids.includes(tube_id)) {
            this.score++
            this.score_e.innerHTML = this.score
            this.tubes_passed_ids.push(tube_id)
        }
    }

    sky_change() {
        let img = document.querySelector('.cloud-sky')
        if(img.src === "./cloud-sky.jpeg" && score % 5 == 0)
            img.src = "./night-sky.avif"
        else if(img.src === "./night-sky.avif" && score % 10 == 0)
            img.src = "./cloud-sky.jpeg"
    }

    touchstart() {
        clearInterval(this.interval_touch_falling_bird)
        this.interval_touch_flying_bird = setInterval(this.flying_bird, 20)
    }

    touchend() {
        clearInterval(this.interval_touch_flying_bird)
        this.interval_touch_falling_bird = setInterval(this.falling_bird, 20)
    }

    onmousedown_func() {
        clearInterval(this.interval_mouse_falling_bird)
        this.interval_mouse_flying_bird = setInterval(this.flying_bird.bind(this), 20)
    }

    onmouseup_func(){
        clearInterval(this.interval_mouse_flying_bird)
        this.interval_mouse_falling_bird = setInterval(this.falling_bird.bind(this), 20)
    }

    change_device(device) {
        document.body.onmousedown = (e) => e.preventDefault()
        document.body.removeEventListener("touchstart", this.mobile_touch_starter)
        if(device == 'mobile') {
            document.body.addEventListener("touchstart", this.touchstart.bind(this))
            document.body.addEventListener("touchend", this.touchend.bind(this))
        }
        else {
            document.body.onmousedown = this.onmousedown_func.bind(this)
            document.body.onmouseup = this.onmouseup_func.bind(this)
        }
    }
    mobile_touch_starter() { this.change_device('mobile') }
    desktop_mouse_starter() { this.change_device('desktop') }
}

var game = new FlappyBirdGame(window.innerHeight, window.innerWidth)