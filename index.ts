// Import stylesheets
import { jourAprès } from './jourApres';
import './style.css';
import './utils';
import { Assertion, LogTests } from './utils';

/***********************************************************************************************************************
 * A FAIRE : Complétez avec votre mail UGA
 */
const mailIdentification = 'ibrahima.barry2@etu.univ-grenoble-alpes.fr';

/***********************************************************************************************************************
 * A FAIRE : Liste de tests à effectuer
 * Chaque test est exprimé par un objet contenant 3 attributs
 *   - args : le tableau des arguments à passer à la fonction f
 *   - expectedResult : le résultat attendu
 *   - comment : un commentaire sous forme de chaine de caractère
 */
const tests: Assertion<Parameters<typeof jourAprès>, ReturnType<typeof jourAprès>>[] = [
  // Pour étudiants
  { args: [[4, 2, 1]], expectedResult: [5, 2, 1], comment: '' },
  { args: [[1.4, 12, 4]], expectedError: "date invalide", comment: 'les jours doivent être entiers.' },
  { args: [[4, 2, 1]], expectedResult: [5, 2, 1], comment: '' },

  // Test pour les dates invalide
  {
    args: [[1.4, 12, 2008]],
    expectedError: 'date invalide',
    comment: 'les jours doivent être entiers.',
  },
  {
    args: [[12, 1.2, 2020]],
    expectedError: 'date invalide',
    comment: 'les mois doivent être entiers.',
  },
  {
    args: [[4, 12, 2018.5]],
    expectedError: 'date invalide',
    comment: 'les années  doivent être entiers.',
  },
  {
    args: [[-4, 12, 2018.5]],
    expectedError: 'date invalide',
    comment: 'les jours  doivent être entiers > 0.',
  },
  {
    args: [[4, -12, 2018.5]],
    expectedError: 'date invalide',
    comment: 'les mois  doivent être entiers > 0.',
  },
  // Test pour le mois de février
  {
    args: [[30, 2, 2004]],
    expectedError: 'date invalide',
    comment: 'le moi de février n atteint pas 30.',
  },
  {
    args: [[30, 2, 2007]],
    expectedError: 'date invalide',
    comment: 'le moi de février n atteint pas 30.',
  },
  {
    args: [[31, 2, 2020]],
    expectedError: 'date invalide',
    comment: 'le moi de février n atteint pas 31.',
  },
  {
    args: [[31, 2, 2005]],
    expectedError: 'date invalide',
    comment: "le moi de février n'ateint pas 31.",
  },
  {
    args: [[29, 2, 2011]],
    expectedError: 'date invalide',
    comment: "l'année 2011 n'est pas bissextille ",
  },
  {
    args: [[28, 2, 2004]],
    expectedResult: [29, 2, 2004],
    comment:
      '2004 étant une anné bissextille 28, 2, 2004 dévrait donnée 29, 2, 2004 ',
  },
  {
    args: [[29, 2, 2004]],
    expectedResult: [1, 3, 2004],
    comment:
      '2004 étant une anné bissextille 29, 2, 2004 dévrait donnée 1, 3, 2004 ',
  },
  // Test pour les mois de 30 jours
  {
    args: [[30, 4, 4]],
    expectedResult: [1, 5, 4],
    comment: 'avril un mois de 30 jours : 30, 4, 4 dévrait donnée 1, 5, 4',
  },
  {
    args: [[30, 6, 5]],
    expectedResult: [1, 7, 5],
    comment: 'juin un mois de 30 jours : 30, 6, 5 dévrait donnée 1, 7, 5',
  },
  { args: [[30, 9, 20]], expectedResult: [1, 10, 20], comment: '' },
  { args: [[30, 11, 40]], expectedResult: [1, 12, 40], comment: '' },
  // Test sur les mois de 31 jours
  { args: [[31, 1, 2014]], expectedResult: [1, 2, 2014], comment: '' },
  { args: [[31, 3, 2017]], expectedResult: [1, 4, 2017], comment: '' },
  { args: [[31, 5, 2022]], expectedResult: [1, 6, 2022], comment: '' },
  { args: [[31, 7, 2023]], expectedResult: [1, 8, 2023], comment: '' },
  { args: [[31, 8, 2023]], expectedResult: [1, 9, 2023], comment: '' },
  { args: [[31, 10, 2022]], expectedResult: [1, 11, 2022], comment: '' },
  { args: [[31, 12, 2023]], expectedResult: [1, 1, 2024], comment: '' },

  { args: [[31, 12, -1]], expectedResult: [1, 1, 0], comment: '' },

];




















/***********************************************************************************************************************
 * NE PAS TOUCHER !!!
 */
LogTests<typeof jourAprès>(
  "Fonction qui renvoie le jour d'après",
  jourAprès,
  'jourAprès',
  tests,
  document.querySelector('#local')!
);

const url =
  'https://script.google.com/macros/s/AKfycbzKQQrXJTNPI9Di-eRA7X5jv93fwVCiTyrcyfOjhqe8yiF-xPkdyA7X-uWSFKhuggdM/exec';

const bt = document.querySelector('button')!;
const section = document.querySelector('#results')!;

bt.onclick = async () => {
  bt.disabled = true;
  const fstr = jourAprès.toString();
  const bodyStr = fstr.slice(fstr.indexOf('{') + 1, fstr.lastIndexOf('}'));
  const paramsString = fstr.slice( 0, fstr.indexOf('{') - 1 )

  const form = new FormData();
  form.append('id', mailIdentification);
  form.append('f', bodyStr);
  form.append('params', paramsString)
  form.append('tests', JSON.stringify(tests));

console.log("POST...")
  const R = await fetch(url, {
    method: 'POST',
    body: form,
  });
  console.log("...received response ...")
  const res: {error: string} | {testPassed: boolean[]} = await R.json();
  console.log("... response decoded.")
  let t = 0;
  const resErr = res as {error: string};
  if ( resErr.error ) {
    section.innerHTML = `<pre>${resErr.error}</pre>`;
    const [,strT] = /([0-9]*) secondes$/.exec(resErr.error)!;
    t = + strT;
    console.log(strT, t);
    const inter = setInterval( () => {
      t--;
      if (t <= 0) {
        bt.disabled = false;
        section.textContent = '';
        clearInterval(inter);
      } else {
        section.innerHTML = `<pre>Vous ne pouvez pas resoumettre avant ${t} secondes
  </pre>`;
      }
    }, 1000 );
  } else {
    const resOK = res as {testPassed: boolean[], testsVsCoderef: boolean[], discardedMutants: boolean[]};
    console.log("no errors...")
    section.innerHTML = `
      Tests de référence passés par votre code (vert = le test passe):<br/>
      <table class="result"><tbody><tr>
      ${resOK.testPassed.map((t, i) => `<td class="${t?'':'in'}correct">${i}</td>`).join('')}
      </tr></tbody></table>
      <br/><br/>
      Vos tests passés sur le code de référence :<br/>
      <table class="result"><tbody><tr>
      ${resOK.testsVsCoderef.map((t, i) => `<td class="${t?'':'in'}correct">${i}</td>`).join('')}
      </tr></tbody></table>
      <br/><br/>
      Mutants éliminés par vos tests (vert = le mutant est éliminé) :<br/>
      <table class="result"><tbody><tr>
      ${resOK.discardedMutants.map((t, i) => `<td class="${t?'':'in'}correct">${i}</td>`).join('')}
      </tr></tbody></table>
    `;
  }
};
