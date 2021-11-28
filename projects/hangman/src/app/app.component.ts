import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-hangman',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Hangman';
  alphabets = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];

  hints = [
    [
      'Based in Mersyside',
      'Based in Mersyside',
      'First Welsh team to reach the Premier Leauge',
      'Owned by A russian Billionaire',
      'Once managed by Phil Brown',
      '2013 FA Cup runners up',
      "Gazza's first club",
    ],
    [
      'Science-Fiction horror film',
      '1971 American action film',
      'Historical drama',
      'Anamated Fish',
      'Giant great white shark',
    ],
    [
      'Northern city in the UK',
      'Home of AC and Inter',
      'Spanish capital',
      'Netherlands capital',
      'Czech Republic capital',
    ],
  ];

  categories = [
    [
      'everton',
      'liverpool',
      'swansea',
      'chelsea',
      'hull',
      'manchester-city',
      'newcastle-united',
    ],
    ['alien', 'dirty-harry', 'gladiator', 'finding-nemo', 'jaws'],
    ['manchester', 'milan', 'madrid', 'amsterdam', 'prague'],
  ];
  // Array of topics
  chosenCategory: Array<string> = []; // Selected catagory

  word = ''; // Selected word
  geusses: Array<string> = []; // Stored geusses
  counter = 0; // Count correct geusses
  space = 0; // Number of spaces in word '-'
  lives = 0;
  showLives = '';
  showClue = '';
  showCatagoryName = '';
  correctGeusses: Array<string> = [];

  @ViewChild('stickman')
  myCanvas: ElementRef<HTMLCanvasElement> = {} as ElementRef;

  context: CanvasRenderingContext2D | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.context = this.myCanvas.nativeElement.getContext('2d')!;
    this.play();
    this.cdr.detectChanges();
  }

  play() {
    this.chosenCategory =
      this.categories[Math.floor(Math.random() * this.categories.length)];

    this.word =
      this.chosenCategory[
        Math.floor(Math.random() * this.chosenCategory.length)
      ];
    this.word = this.word.replace(/\s/g, '-');
    console.log(this.word);
    this.geusses = [];
    this.lives = 10;
    this.counter = 0;
    this.space = 0;
    this.resetButtons();
    this.result();
    this.comments();
    this.selectCat();
    this.canvas();
  }

  resetButtons() {
    document.querySelectorAll('#alphabet li').forEach((item) => {
      item.removeAttribute('class');
    });
  }

  reset() {
    this.showClue = '';
    this.context!.clearRect(0, 0, 400, 400);
    this.play();
  }

  check(event: Event, geuss: string) {
    // this.onclick = null;
    let target = event.currentTarget as HTMLElement;
    let hasClass = target.attributes.getNamedItem('class');
    if (hasClass) return;
    target.setAttribute('class', 'active');
    for (var i = 0; i < this.word.length; i++) {
      if (this.word[i] === geuss) {
        this.geusses[i] = geuss;
        this.counter += 1;
      }
    }
    console.log(this.geusses);
    var j = this.word.indexOf(geuss);
    if (j === -1) {
      this.lives -= 1;
      this.comments();
      this.animate();
    } else {
      this.comments();
    }
  }

  comments() {
    this.showLives = 'You have ' + this.lives + ' lives';
    if (this.lives < 1) {
      this.showLives = 'Game Over';
    }
    for (var i = 0; i < this.geusses.length; i++) {
      if (this.counter + this.space === this.geusses.length) {
        this.showLives = 'You Win!';
      }
    }
  }

  animate() {
    var drawMe = this.lives;
    console.log(this.drawArray[drawMe]);
    console.log(drawMe);
    this.drawArray[drawMe].call(this);
  }

  selectCat() {
    if (this.chosenCategory === this.categories[0]) {
      this.showCatagoryName =
        'The Chosen Category Is Premier League Football Teams';
    } else if (this.chosenCategory === this.categories[1]) {
      this.showCatagoryName = 'The Chosen Category Is Films';
    } else if (this.chosenCategory === this.categories[2]) {
      this.showCatagoryName = 'The Chosen Category Is Cities';
    }
  }

  // Create geusses ul
  result() {
    let guess = '';
    for (var i = 0; i < this.word.length; i++) {
      if (this.word[i] === '-') {
        guess = '-';
        this.space = 1;
      } else {
        guess = '_';
      }

      this.geusses.push(guess);
      this.correctGeusses.push(guess);
    }
  }

  showHint() {
    var catagoryIndex = this.categories.indexOf(this.chosenCategory);
    var hintIndex = this.chosenCategory.indexOf(this.word);
    this.showClue = 'Clue: - ' + this.hints[catagoryIndex][hintIndex];
  }

  canvas() {
    if (this.context == null) return;

    this.context.beginPath();
    this.context.strokeStyle = '#fff';
    this.context.lineWidth = 2;
  }

  head() {
    if (this.context == null) return;

    this.context.beginPath();
    this.context.arc(60, 25, 10, 0, Math.PI * 2, true);
    this.context.stroke();
  }

  draw(
    $pathFromx: number,
    $pathFromy: number,
    $pathTox: number,
    $pathToy: number
  ) {
    if (this.context == null) return;

    this.context.moveTo($pathFromx, $pathFromy);
    this.context.lineTo($pathTox, $pathToy);
    this.context.stroke();
  }

  frame1() {
    this.draw(0, 150, 150, 150);
  }

  frame2() {
    this.draw(10, 0, 10, 600);
  }

  frame3() {
    this.draw(0, 5, 70, 5);
  }

  frame4() {
    this.draw(60, 5, 60, 15);
  }

  torso() {
    this.draw(60, 36, 60, 70);
  }

  rightArm() {
    this.draw(60, 46, 100, 50);
  }

  leftArm() {
    this.draw(60, 46, 20, 50);
  }

  rightLeg() {
    this.draw(60, 70, 100, 100);
  }

  leftLeg() {
    this.draw(60, 70, 20, 100);
  }

  drawArray = [
    this.rightLeg,
    this.leftLeg,
    this.rightArm,
    this.leftArm,
    this.torso,
    this.head,
    this.frame4,
    this.frame3,
    this.frame2,
    this.frame1,
  ];
}
