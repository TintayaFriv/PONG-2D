class Escena extends Phaser.Scene{

	preload(){
		this.load.image('fondo','img/fondo.jpg');
		this.load.spritesheet('bola','img/bola.png',{
			frameWidth: 100,
			frameHeight: 100
		});
		this.load.image('mano1','img/mano1.png');
		this.load.image('mano2','img/mano2.png');
		this.load.image('leftbtn','img/flecha.png');
		this.load.audio('fondo','sonidos/FONDO.mp3');
		this.load.audio('colision_mano', 'sonidos/GOLPEMANO.mp3');
        this.load.audio('colision_robot', 'sonidos/GOLPEROBOT.mp3');
	}

	create(){
        this.velocidad_aun=500;
		this.input.addPointer();
		this.input.addPointer();
		this.input.addPointer();

		this.add.sprite(400,320,'fondo');
		this.bola = this.physics.add.sprite(400,320,'bola');
		this.bola2 = this.physics.add.sprite(400,320,'bola');

		this.anims.create({
			key: 'brillar',
			frames: this.anims.generateFrameNumbers('bola',{
				start: 0,
				end: 3
			}),
			frameRate: 10,
			repeat: -1			
		});
		this.bola.play('brillar');
		this.bola2.play('brillar');

		this.bola.setBounce(1);
		this.mano1 = this.physics.add.sprite(70,320,'mano1');
		this.mano1.body.immovable = true;
		this.bola.setBounce(10);
		this.mano1.setSize(60,250);
		//this.physics.add.collider(this.bola,this.mano1);
		//this.physics.add.collider(this.bola2,this.mano1);
        this.physics.add.collider(this.bola, this.mano1, () => {
            this.sound.play('colision_mano');
        });
        this.physics.add.collider(this.bola2, this.mano1, () => {
            this.sound.play('colision_mano');
        });		
		this.mano1.setCollideWorldBounds(true);

		

		//sengundo jugador
		this.mano2 = this.physics.add.sprite(882,320, 'mano2');
		this.mano2.body.immovable = true;
		this.mano2.setBounce(10);
		this.mano2.setSize(60,250);
		//this.physics.add.collider(this.bola,this.mano2);
		//this.physics.add.collider(this.bola2,this.mano2);
        this.physics.add.collider(this.bola, this.mano2, () => {
            this.sound.play('colision_robot');
        });
        this.physics.add.collider(this.bola2, this.mano2, () => {
            this.sound.play('colision_robot');
        });
		this.mano2.setCollideWorldBounds(true);

		let velocidad = 500;
		
		let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
		let anguloInicial2 = -1 * (Math.random() * Math.PI / 2 + Math.PI /4);
		const derechaOIzq = Math.floor(Math.random() * 2);
		if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;
		
		const vx = Math.sin(anguloInicial)*velocidad;
		const vy = Math.cos(anguloInicial)*velocidad;
		const vx2 = Math.cos(anguloInicial2)*velocidad;
		const vy2 = Math.sin(anguloInicial2)*velocidad;

		
		this.bola.setBounce(1);
		this.bola.setCollideWorldBounds(true);
		this.physics.world.setBoundsCollision(false,false,true,true);

		this.bola2.setBounce(1);
		this.bola2.setCollideWorldBounds(true);
		this.physics.world.setBoundsCollision(false,false,true,true);

		this.bola.body.velocity.x = vx;
		this.bola.body.velocity.y = vy;
		this.bola2.body.velocity.x = vx2;
		this.bola2.body.velocity.y = vy2;

		this.cursors = this.input.keyboard.createCursorKeys();
		
		this.controlesVisuales({
			x:50,
			y:50
		}, {
			x: 50,
			y: 590
		}, this.mano1);
		//controles visuales para el segundo jugador
		this.controlesVisuales({
			x:910,
			y:50
		}, {
			x: 910,
			y: 590
		}, this.mano2);

		this.alguienGano = false;
		this.pintarMarcador();

        this.nivel = 1;
        this.nivelTexto = this.add.text(480, 600, 'NIVEL 1', {
            fontFamily: 'font1',
            fontSize: 40,
            color: '#ffffff'
        }).setOrigin(0.5);

		//reproducir sonido de fondo
		this.sonidoFondo = this.sound.add('fondo',{loop:true});
		this.sonidoFondo.play();

        this.finDeJuego = false;
		
	}

	update(){
        if (this.finDeJuego) {
            return;
        }

		this.bola.rotation += 0.1;
		this.bola2.rotation -= 0.1;
		
		if (this.bola.x < 0 && this.alguienGano === false){
			//alert('player1 has perdido');
			this.alguienGano = true;
			this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
			this.colocarPelota();
		}else if (this.bola.x > 960 && this.alguienGano === false){
			//alert('player2 has perdido');
			this.alguienGano = true;
			this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
			this.colocarPelota();
		}

		if (this.bola2.x < 0 && this.alguienGano === false){
			//alert('player1 has perdido');
			this.alguienGano = true;
			this.marcadorMano2.text = parseInt(this.marcadorMano2.text) + 1;
			this.colocarPelota2();
		}else if (this.bola2.x > 960 && this.alguienGano === false){
			//alert('player2 has perdido');
			this.alguienGano = true;
			this.marcadorMano1.text = parseInt(this.marcadorMano1.text) + 1;
			this.colocarPelota2();
		}

        if (parseInt(this.marcadorMano1.text) >= 15 || parseInt(this.marcadorMano2.text) >= 15) {
            this.subirDeNivel();
        }

        if (parseInt(this.marcadorMano1.text) >= 30 || parseInt(this.marcadorMano2.text) >= 30) {
            this.terminarJuego();
        }

		//movimiento de mano
		if (this.cursors.up.isDown || this.mano1.getData('direccionVertical') === 1) {
			this.mano1.y = this.mano1.y - 5;
		}else if(this.cursors.down.isDown || this.mano1.getData('direccionVertical') === -1){
			this.mano1.y = this.mano1.y + 5;
		}
		if (this.cursors.up.isDown || this.mano2.getData('direccionVertical') === 1) {
			this.mano2.y = this.mano2.y - 5;
		}else if(this.cursors.down.isDown || this.mano2.getData('direccionVertical') === -1){
			this.mano2.y = this.mano2.y + 5;
		}
		
	}

	pintarMarcador(){
		this.marcadorMano1 = this.add.text(440,75, '0', {
			fontFamily: 'font1',
			fontSize: 80,
			color: '#ffffff',
			aling: 'right'
		}).setOrigin(1,0);;
		this.marcadorMano2 = this.add.text(520,75, '0', {
			fontFamily: 'font1',
            fontSize: 80,
            color: '#ffffff',
		});
	}

	colocarPelota() {
		let velocidad = this.velocidad_aun;
		
		let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
		const derechaOIzq = Math.floor(Math.random() * 2);
		if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;
		
		const vx = Math.sin(anguloInicial)*velocidad;
		const vy = Math.cos(anguloInicial)*velocidad;
		
		this.bola = this.physics.add.sprite(400,320,'bola');
		this.bola.play('brillar');

		this.bola.setBounce(1);
		this.physics.world.enable(this.bola);

		this.bola.setCollideWorldBounds(true);
		this.physics.world.setBoundsCollision(false,false,true,true);

		this.bola.body.velocity.x = vx;
		this.bola.body.velocity.y = vy;
		//this.physics.add.collider(this.bola,this.mano1);
		//this.physics.add.collider(this.bola,this.mano2);
        this.physics.add.collider(this.bola, this.mano1, () => {
            this.sound.play('colision_mano');
        });
        this.physics.add.collider(this.bola, this.mano2, () => {
            this.sound.play('colision_robot');
        });	

		this.alguienGano = false;
	}

	colocarPelota2() {
		let velocidad = this.velocidad_aun;
		
		let anguloInicial = Math.random() * Math.PI / 2 + Math.PI / 4;
		const derechaOIzq = Math.floor(Math.random() * 2);
		if (derechaOIzq === 1) anguloInicial = anguloInicial + Math.PI;
		
		const vx = Math.sin(anguloInicial)*velocidad;
		const vy = Math.cos(anguloInicial)*velocidad;
		
		this.bola2 = this.physics.add.sprite(400,320,'bola');
		this.bola2.play('brillar');

		this.bola2.setBounce(1);
		this.physics.world.enable(this.bola2);

		this.bola2.setCollideWorldBounds(true);
		this.physics.world.setBoundsCollision(false,false,true,true);

		this.bola2.body.velocity.x = vx;
		this.bola2.body.velocity.y = vy;
		//this.physics.add.collider(this.bola2,this.mano1);
		//this.physics.add.collider(this.bola2,this.mano2);
        this.physics.add.collider(this.bola2, this.mano1, () => {
            this.sound.play('colision_mano');
        });
        this.physics.add.collider(this.bola2, this.mano2, () => {
            this.sound.play('colision_robot');
        });
		
		this.alguienGano = false;
	}

    subirDeNivel() {
        if (this.nivel === 2) return;
        this.nivel = 2;
        this.nivelTexto.setText('NIVEL 2');
        this.velocidad_aun *= 2;
    }

	controlesVisuales(btn1, btn2, player){
		player.setData('direccionVertical',0);

		const upbtn = this.add.sprite(btn1.x, btn1.y, 'leftbtn').setInteractive();
		const downbtn = this.add.sprite(btn2.x, btn2.y, 'leftbtn').setInteractive();
		downbtn.flipY = true;

		downbtn.on('pointerdown', () => {
			player.setData('direccionVertical', -1);
		});
		
		upbtn.on('pointerdown', () => {
			player.setData('direccionVertical', 1);
		});

		downbtn.on('pointerup', () => {
			player.setData('direccionVertical', 0);
		});

		upbtn.on('pointerup', () => {
			player.setData('direccionVertical', 0);
		});
	}

    terminarJuego() {
        // Detener el juego
        this.finDeJuego = true;
    
        // Detener la bola
        this.bola.setVelocity(0, 0);
        this.bola2.setVelocity(0, 0);
    
        // Mostrar texto "FIN DE JUEGO"
        this.add.text(480, 320, 'FIN DE JUEGO', {
            fontFamily: 'font1',
            fontSize: 60,
            color: '#ffffff'
        }).setOrigin(0.5);
    
        // Parar música de fondo
        this.sonidoFondo.stop();
    }

}

const config = {
	type: Phaser.AUTO,
	width: 960,
	height:640,
	scene: Escena,
	physics: {
		default: 'arcade',
	},
};

new Phaser.Game(config);