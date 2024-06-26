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
- [ ] Select za krivuljo samo tam, kjer ima smisel!
- [ ] Risanje kroga z racionalnimi bezierjevimi krivuljami
- [x] Dodat bernsteinove polinome... ni cisto brezsmiselno. Graf pokaze koliko tocka za dolocen t doda pri kalkulaciji
  tocke na krivulji!!
- [ ] Osnova grafa naj bo renderirana enako pri Bernsteinovih polinomih kot BaseGraph... trenutno je skopirana
- [x] Size context?
- [ ] Različni preseti za inicializacijo grafa - torej primeri iz magistrske, ki jih lahko kar izbereš iz dropdownov!
  Tako bom zagotovil konsistenco med slikami. V inicializacijo lahko dodam tudi bounding box parameter itd.

### Low Priority

- [ ] Morda dodamo dolžino krivulje nekam na graf PH krivulj? Glede na to da o tem govorim v delu, bi se najbrz
  spodoblo.
- [x] Caching za kak izracun tock? Vsaj za tiste hodografe v PH (offset) krivuljah, se vseeno more bit vse skupaj
  reaktivno, ampak ce se le da, da se ne racunajo tolko hard vsak korak.
- [ ] Selected curve commands bi se morali prebrat direktno iz krivulje. Tako bi lahko vec razlicnih krivulj na isti
  graf risal in bi dejansko vsaka svoje renderirala...
- [ ] Mogoce celo, ce bi naredu interface za vsako "metodo" in potem naredu da ce implementira, potem nastavi command,
  drugace pa ne.
- [ ] JSX/JXG imenovanje na pravih mestih pravo!
- [ ] Uporabi Javascript get/set ne nekih svojih pisat!
- [ ] Make JGBox self-initiating! it should be possible!
- [ ] Resizanje v obe smeri za PH krivulje...TOLE MOGOCE CELO NE GRE, dobro razmisli ce strig ohrani PH...
- [ ] Poglej še enkrat Decasteljau, tisto je bilo pisano DOLGO nazaj. Mogoče lahko tudi dam uporabiš caching sistem.
- [ ] JSXKrivulje bi lahko imele "wrapControlPoints()", ki bi vzele krivuljo, in njene kontrolne tocke zawrappala v
  JSXTocke...
- [ ] Mogoce pri bernsteinovih naredit nek plotchart kolko kateri vpliva?
- [x]