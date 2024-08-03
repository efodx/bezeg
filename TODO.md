## Za naredit

### High Priority

- [x] Fix set weights racionalne
- [x] PH Krivulje naj imajo samo eno startno tocko + hodografe za konstruktor
- [x] Fix offset quintic PH krivulje!
- [x] Fix resizanje PH krivulj
- [ ] Bezier krivulja, ki bo delovala na poljubnem stevilu dimenzij. Mogoce tako, da Point interface razsirim na
  poljubno stevilo.
- [x] Abstrahirat zadeve pri PH krivuljah, da se koda pouporabi
- [x] Hodografi PH krivulj naj bojo v locenem grafu, mogoce celo kot select curve command
- [x] Odstrani styles in uporabljaj bootstrap classe za oblikovanje
- [x] RESIZABLE GRAF!!! - **resizas okno, ostane pa aspect ratio!**
- [x] Prikaz kontrolnih točk offset krivulje
- [x] Dodajanje točk zlepkom
- [x] Select za krivuljo samo tam, kjer ima smisel!
- [x] Risanje kroga z racionalnimi bezierjevimi krivuljami
- [x] Dodat bernsteinove polinome... ni cisto brezsmiselno. Graf pokaze koliko tocka za dolocen t doda pri kalkulaciji
  tocke na krivulji!!
- [x] Osnova grafa naj bo renderirana enako pri Bernsteinovih polinomih kot BaseGraph... trenutno je skopirana
- [x] Size context?
- [x] Različni preseti za inicializacijo grafa - torej primeri iz magistrske, ki jih lahko kar izbereš iz dropdownov!
  Tako bom zagotovil konsistenco med slikami. V inicializacijo lahko dodam tudi bounding box parameter itd. - to je
  lahko kr graph property - presets, potem jih class poljubno uporabi pri inicializaciji
  Naj se da Presete ustvarjat tudi svoje... Da shranis krivuljo recimo itd... nekako bo treba dosezt te stvari.
  Tako bo lahko profesor si ustvaril krivuljo in jo potem shranil. In dosezem tudi, da lahko potem te presete poimensko
  eksportam!
- [x] Decasteljau generateLineSegments(slider: JXG.Slider) in se ena metoda... naj bo to abstrahirano kar je lahko.
- [x] ODSTRANI SLIDERJE KER DELAJO GUZVO NA SLIKAH
- [x] Naj se da odstranit oznake točk tudi za segmente..... MORDA DODAM VISIBILITY MED CONTEXTE...
- [ ] Na G1 zlepkih da premikamo alphe
- [ ] Oznake za transformacije pri izbrani krivulji - pac pointer changes.

### Low Priority

- [ ] Morda dodamo dolžino krivulje nekam na graf PH krivulj? Glede na to da o tem govorim v delu, bi se najbrz
  spodoblo.
- [x] Caching za kak izracun tock? Vsaj za tiste hodografe v PH (offset) krivuljah, se vseeno more bit vse skupaj
  reaktivno, ampak ce se le da, da se ne racunajo tolko hard vsak korak.
- [x] Selected curve commands bi se morali prebrat direktno iz krivulje. Tako bi lahko vec razlicnih krivulj na isti
  graf risal in bi dejansko vsaka svoje renderirala...
- [ ] Mogoce celo, ce bi naredu interface za vsako "metodo" in potem naredu da ce implementira, potem nastavi command,
  drugace pa ne.
- [ ] JSX/JXG imenovanje na pravih mestih pravo!
- [ ] Uporabi Javascript get/set ne nekih svojih pisat! -- to ni sans da se mi bo dalo popravljat x]
- [ ] Make JGBox self-initiating! it should be possible!
- [x] Resizanje v obe smeri za PH krivulje...TOLE MOGOCE CELO NE GRE, dobro razmisli ce strig ohrani PH... NO GO BBY
- [x] Poglej še enkrat Decasteljau, tisto je bilo pisano DOLGO nazaj. Mogoče lahko tudi dam uporabiš caching sistem.
- [x] JSXKrivulje bi lahko imele "wrapControlPoints()", ki bi vzele krivuljo, in njene kontrolne tocke zawrappala v
  JSXTocke... NAH
- [x] Mogoce pri bernsteinovih naredit nek plotchart kolko kateri vpliva?
- [ ] Decasteljau brez dejanske sheme, tako da narisem zadnji 2 bezierjevi krivulji ki sta interpolirani? :D za pokazat
  shemo...
- [ ] Bezierjeve API spremenit na Subdividable, Expotrapolable, Elevatable......
- [ ] Ce clovek pogleda formulo za visanje krivulje... Iz nje sledi, da tiste tocke v resnici lezijo na kontrolnem
  poligonu... To bi lahko prikazal!

USE THIS PALETTE

/* CSS HEX */
--dark-moss-green: #3B6704ff;
--dark-moss-green-2: #264901ff;
--cornflower-blue: #5896F9ff;
--citron: #CFCB7Aff;
--olivine: #AFB665ff;

/* CSS HSL */
--dark-moss-green: hsla(87, 93%, 21%, 1);
--dark-moss-green-2: hsla(89, 97%, 15%, 1);
--cornflower-blue: hsla(217, 93%, 66%, 1);
--citron: hsla(57, 47%, 65%, 1);
--olivine: hsla(65, 36%, 55%, 1);

/* SCSS HEX */
$dark-moss-green: #3B6704ff;
$dark-moss-green-2: #264901ff;
$cornflower-blue: #5896F9ff;
$citron: #CFCB7Aff;
$olivine: #AFB665ff;

/* SCSS HSL */
$dark-moss-green: hsla(87, 93%, 21%, 1);
$dark-moss-green-2: hsla(89, 97%, 15%, 1);
$cornflower-blue: hsla(217, 93%, 66%, 1);
$citron: hsla(57, 47%, 65%, 1);
$olivine: hsla(65, 36%, 55%, 1);

/* SCSS RGB */
$dark-moss-green: rgba(59, 103, 4, 1);
$dark-moss-green-2: rgba(38, 73, 1, 1);
$cornflower-blue: rgba(88, 150, 249, 1);
$citron: rgba(207, 203, 122, 1);
$olivine: rgba(175, 182, 101, 1);

/* SCSS Gradient */
$gradient-top: linear-gradient(0deg, #3B6704ff, #264901ff, #5896F9ff, #CFCB7Aff, #AFB665ff);
$gradient-right: linear-gradient(90deg, #3B6704ff, #264901ff, #5896F9ff, #CFCB7Aff, #AFB665ff);
$gradient-bottom: linear-gradient(180deg, #3B6704ff, #264901ff, #5896F9ff, #CFCB7Aff, #AFB665ff);
$gradient-left: linear-gradient(270deg, #3B6704ff, #264901ff, #5896F9ff, #CFCB7Aff, #AFB665ff);
$gradient-top-right: linear-gradient(45deg, #3B6704ff, #264901ff, #5896F9ff, #CFCB7Aff, #AFB665ff);
$gradient-bottom-right: linear-gradient(135deg, #3B6704ff, #264901ff, #5896F9ff, #CFCB7Aff, #AFB665ff);
$gradient-top-left: linear-gradient(225deg, #3B6704ff, #264901ff, #5896F9ff, #CFCB7Aff, #AFB665ff);
$gradient-bottom-left: linear-gradient(315deg, #3B6704ff, #264901ff, #5896F9ff, #CFCB7Aff, #AFB665ff);
$gradient-radial: radial-gradient(#3B6704ff, #264901ff, #5896F9ff, #CFCB7Aff, #AFB665ff);