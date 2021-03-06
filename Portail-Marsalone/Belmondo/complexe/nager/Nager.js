class Nager extends Phaser.Scene {
    //ON PRECHARGE TOUS NOS ASSETS
    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.image('water', 'assets/water.png');
        //PRECHARGE DU SPRITESHEET AVEC LES DIFFERENTES POSITIONS DU PERSONNAGE
        this.load.spritesheet('gerard', 'assets/walk.png', { frameWidth: 20, frameHeight: 35 });
        this.load.spritesheet('nage', 'assets/nage.png', { frameWidth: 26, frameHeight: 37 });
        this.load.spritesheet('nagestat', 'assets/nagestatique.png', { frameWidth: 40, frameHeight: 57 });
    }
    //ON DETERMINE DANS LA FONCTION CREATE CE QUE FONT NOS ASSETS
    create ()
    {
        this.add.image(400, 300, 'sky');


//CREATION D'UN GROUPE POUR LA REPETITION D'UN OBJET
        platforms = this.physics.add.staticGroup();//ON DETERMINE SON EMPLACEMENT ET SA TEXTURE

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(50, 350, 'ground').setDisplaySize(100,400).refreshBody();
        platforms.create(750, 350, 'ground').setDisplaySize(100,400).refreshBody();

//CREATION DES ACTIONS DU PERSONNAGE
        player = this.physics.add.sprite(50, 100, 'gerard');

        //player.setBounce(0.2);// REBONDISSEMENT DU PERSONNAGE LORSQU'IL SAUTE
        player.setCollideWorldBounds(true);//COLLISION AVEC TOUS LES OBJETS DU JEU

        this.water = this.physics.add.sprite(400,347, 'water').setDisplaySize(600,380);
        this.water.body.setAllowGravity(false);


//CREATION DES ANIMATIONS DU PERSONNAGE GRACE AU SPRITESHEET
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('gerard', { start: 0, end: 3 }),//CE SONT LES IMAGES 0/1/2/3 QUI SONT JOUEES
            frameRate: 10,//NOMBRE D'IMAGES JOUEES
            repeat: -1//REPETITION INFINIE
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'gerard', frame: 4 } ],//C'EST L'IMAGE 4 QUI EST JOUEE
            frameRate: 20//NOMBRE D'IMAGES JOUEES
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('gerard', { start: 5, end: 8 }),//CE SONT LES IMAGES 5/6/7/8 QUI SONT JOUEES
            frameRate: 10,//NOMBRE D'IMAGES JOUEES
            repeat: -1//REPETITION INFINIE
        });

        this.anims.create({
            key: 'tombe',
            frames: this.anims.generateFrameNumbers('gerard', { start: 5, end: 8 }),//CE SONT LES IMAGES 5/6/7/8 QUI SONT JOUEES
            frameRate: 10,//NOMBRE D'IMAGES JOUEES
            repeat: 1//REPETITION INFINIE
        });

        this.anims.create({
            key: 'nageright',
            frames: this.anims.generateFrameNumbers('nage', { start: 0, end: 2 }),//CE SONT LES IMAGES 5/6/7/8 QUI SONT JOUEES
            frameRate: 10,//NOMBRE D'IMAGES JOUEES
            repeat: 1//REPETITION INFINIE
        });
        this.anims.create({
            key: 'nageleft',
            frames: this.anims.generateFrameNumbers('nage', { start: 3, end: 5 }),//CE SONT LES IMAGES 5/6/7/8 QUI SONT JOUEES
            frameRate: 10,//NOMBRE D'IMAGES JOUEES
            repeat: 1//REPETITION INFINIE
        });


        this.physics.add.collider(player, platforms);//AJOUT DE COLLISION ENTRE LE PERSONNAGE ET LES PLATFORMES

        this.physics.add.overlap(player, this.water );

        this.initKeyboard()
    }
    checkWater(){
        this.inWater=false;
            if (!player.body.touching.none){
                this.inWater=true;
            }
    }

    //LA ON DEFINIT CE QU'IL SE PASSE LORSQU'ON APPUIE SUR TELLE OU TELLE TOUCHE
    initKeyboard() {
        let me = this;
        this.input.keyboard.on('keydown', function (kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.UP:
                    if (me.inWater){
                        player.setVelocityY(-100);
                    }
                    else if (player.body.onFloor() && !me.inWater)
                    {
                        player.setVelocityY(-330);//LE JOUR VA A UNE VITESSE DE 330 VERS LE HAUT
                    }
                    console.log("jump");
                    break;
                case Phaser.Input.Keyboard.KeyCodes.RIGHT:
                    if (me.inWater){
                        player.setVelocityX(100);
                        player.anims.play('nageleft',true);
                    }
                    else {
                        player.setVelocityX(160);//LE PERSONNAGE VA A UNE VITESSE DE A UNE VITESSE DE 160 A DROITE

                        player.anims.play('right', true);//ET ON LUI DEMANDE DE LANCER L'ANIMATION RIGHT QU'ON A CREE DANS LA FONCTION CREATE
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    if (me.inWater){
                        player.setVelocityX(-100);
                        player.anims.play('nageright',true);
                    }
                    else {
                        player.setVelocityX(-160);//LE PERSONNAGE VA A UNE VITESSE DE A UNE VITESSE DE 160 A GAUCHE

                        player.anims.play('left', true);//ET ON LUI DEMANDE DE LANCER L'ANIMATION LEFT QU'ON A CREE DANS LA FONCTION CREATE
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.DOWN:
                    if (me.inWater){
                        player.setVelocityY(100);
                    }
                    break;
            }
        });
        this.input.keyboard.on('keyup', function (kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.UP:
                    if (me.inWater){
                        player.setVelocityY(0);
                    }
                    break;
                case Phaser.Input.Keyboard.KeyCodes.RIGHT:
                    player.setVelocityX(0);//LE PERSO NE BOUGE PAS

                    player.anims.play('turn');//ET ON JOUE L'ANIMATION TUR CREE DANS LA FONCTION CREATE
                    break;
                case Phaser.Input.Keyboard.KeyCodes.LEFT:
                    player.setVelocityX(0);//LE PERSO NE BOUGE PAS

                    player.anims.play('turn');//ET ON JOUE L'ANIMATION TUR CREE DANS LA FONCTION CREATE

                    break;
                case Phaser.Input.Keyboard.KeyCodes.DOWN:
                    if (me.inWater){
                        player.setVelocityY(0);
                    }
                    break;
            }
        });
    }
    update ()
    {
        this.checkWater()
        if (player.body.touching.none || player.body.onFloor()){
        player.body.setGravity(0,0);
        this.inWater=false;
        console.log('!inWtaer')
            }
        else if (this.inWater){
            player.body.setGravity(0,-320);
            console.log('inWater')
        }
    }

}

