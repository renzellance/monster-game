new Vue ({
  el: '#app',
  data: {
    playerHP: 100,
    playerMaxHP: 100,
    monsterName: 'MONSTER',
    monsterArmor: 0,
    monsterHP: 100,
    monsterMaxHP: 100,
    playerMP: 100,
    playerMaxMP: 100,
    isRunning: false,
    turns: [],
  },
  computed: {
    getPlayerHPPercent() {
      return (this.playerHP / this.playerMaxHP) * 100;
    },
    getPlayerMPPercent() {
      return (this.playerMP / this.playerMaxMP) * 100;
    },
    getMonsterHPPercent() {
      return (this.monsterHP / this.monsterMaxHP) * 100;
    },
  },
  methods: {
    startGame() {
      this.isRunning = true;
      this.initializeHero();
      this.initializeMonster();
    },
    initializeHero() {
      this.playerHP = 100;
      this.playerMaxHP = 100;
      this.playerMP = 100;
      this.playerMaxMP = 100;
    },
    upgradeHero() {
      this.playerHP += 20;
      this.playerMaxHP += 20;
      this.playerMP += 20;
      this.playerMaxMP += 20;
    },
    moveToNextLevel() {
      this.upgradeHero();
      this.initializeMonster();
    },
    initializeMonster() {
      const monsterArray = [
        {
          name: 'Cyclops',
          armor: .9,
          health: 90,
        },
        {
          name: 'Basilisk',
          armor: 1,
          health: 100,
        },
        {
          name: 'Centaur',
          armor: .7,
          health: 70,
        },
        {
          name: 'Cyborg Ninja',
          armor: .6,
          health: 60,
        },
        {
          name: 'Kobold',
          armor: .5,
          health: 50,
        },
        {
          name: 'Goblin',
          armor: .4,
          health: 40,
        },
        {
          name: 'Troll',
          armor: .8,
          health: 80,
        }
      ];

      const randomMonster = monsterArray[Math.floor(Math.random() * monsterArray.length)];

      this.monsterName = randomMonster.name;
      this.monsterArmor = randomMonster.armor;
      this.monsterHP = randomMonster.health;
      this.monsterMaxHP = randomMonster.health;
    },
    dmgCalc(min, max) {
      return Math.max(Math.floor(Math.random() * max) + 1, min);
    },
    armorResistCalc(armor) {
      return Math.max(Math.floor(Math.random() * (armor + 1)) + 1, armor - 1);
    },
    checkWin() {
      if (this.monsterHP <= 0) {
        confirm('You won! Continue?') ? this.moveToNextLevel() : this.isRunning = false;
        return true; 
      } else if (this.playerHP <= 0) {
        confirm('You lost! Start a New Game?') ? this.startGame() : this.isRunning = false;
        return true; 
      }
      return false;
    },
    checkMana(cost) {
      return this.playerMP - cost >= 0;
    },
    monsterAtk() {
      let dmg = this.dmgCalc(5, 12);
      this.playerHP -= dmg;
      this.turns.unshift({
        isPlayer: false,
        message: 'Monster attacked player for ' + dmg + ' damage.'
      });
      if (this.playerMP <= 95) {
        this.playerMP += 5;
      }
      else {
        this.playerMP += 100 - this.playerMP;
      }
      this.checkWin();
    },
    regularAtk() {
      let dmg = this.dmgCalc(3, 10) - this.armorResistCalc(this.monsterArmor);
      this.monsterHP -= dmg;
      this.turns.unshift({
        isPlayer: true,
        message: 'Player attacked monster for ' + dmg + ' damage.'
      });
      if (this.checkWin()) {
        return;
      }
      this.monsterAtk();
    },
    specialAtk() {
      if (this.checkMana(25)) {
        this.playerMP -= 25;
        let dmg = this.dmgCalc(1, 20) - this.armorResistCalc(this.monsterArmor);
        this.monsterHP -= dmg;
        this.turns.unshift({
          isPlayer: true,
          message: 'Player attacked monster for ' + dmg + ' special damage.'
        });
        if (this.checkWin()) {
          return;
        }
        this.monsterAtk();
      } else {
        alert('Not enough mana.');
      }
    },
    heal() {
      if (this.checkMana(15)) {
        this.playerMP -= 15;    
        let health = 0;
        this.playerHP <= 90 ? health = 10 : health = 100 - this.playerHP;
        this.playerHP += health;
        this.turns.unshift({
          isPlayer: true,
          message: 'Player healed self for ' + health + ' health.'
        });
        this.monsterAtk();
      } else {
        alert('Not enough mana.');
      }
    },
    giveUp() {
      this.isRunning = false;
    }
  }
});