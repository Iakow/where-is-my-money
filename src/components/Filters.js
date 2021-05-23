/** @jsx createElement */
/** @jsxFrag createFragment */
import { createElement, createFragment } from '../framework/element';

import styles from '../style';
import renderApp from '../framework/render';
import dataStore from '../data/dataStore';
import { getHTMLDate } from '../utils';

export default function Filters() {
  /* 
    Меняем флаги - это состояние фльтров (в частности радиобаттонов), во-первых
    При этом нужно получить новый массив для рендеринга
    1. Это может делать сам рендерящийся компонент при каждом рендеринге, на основе флагов
    2. Отфильтрованный массив можно хранить в стейте
       Вопрос в том, кто будет это делать.
       Этот массив должен формироваться при каждом событии из двух групп:
        1. При изменении состояния фильтров
        2. При изменении оригинального массива (добавление, удаление, редактирование)

        Вот, кстати, интересна первая группа. Выходит, каждый раз при обновлении оригинального массива должна вызываться некая функция, которая на основании флагов сформирует второй массив. Эта функция должна вызываться в хендлерах добавления, удаления, редактирования. Т.е. ее надо будет откуда-то импортировать в каждый из этих файлов. 
        И ее надо будет импортировать, очевидно, в Filters.
        Она явно не должна быть расположена в Filters. 
        ТОГДА ГДЕ???

        Странно, наверное, держать в utils функцию, которая должна полагаться на стейт.
        Странно что-то такое утилитарное импортировать из компонента в другой компонент.

        И еще, setUserData и selectTransactions в чем-то же схожи. Первая формирует что-то в стейте на основе входных данных, вторая делает то же самое. 
        Тогда может они стоят отдельного модуля?
        Ну, или же лучше оставить их там, где они есть...
  */

  function handler({ target }) {
    if (target.name == 'sortBySum') {
      dataStore.sortByDate = 0;
      dataStore.sortBySum = +target.value;
      dataStore.selectTransactions();
      renderApp();
    } else if (target.name == 'sortByDate') {
      dataStore.sortBySum = 0;
      dataStore.sortByDate = +target.value;
      dataStore.selectTransactions();
      renderApp();
    } else if (target.name == 'filterMoneyway') {
      dataStore.filterMoneyway = +target.value;
      dataStore.selectTransactions();
      renderApp();
    }
  }

  const SortBySum = (
    <>
      sortBySum
      <label>
        <input type="radio" name="sortBySum" value="0" checked={dataStore.sortBySum === 0} />
        Off
      </label>
      <label>
        <input type="radio" name="sortBySum" value="1" checked={dataStore.sortBySum === 1} />
        Up
      </label>
      <label>
        <input type="radio" name="sortBySum" value="-1" checked={dataStore.sortBySum === -1} />
        Down
      </label>
    </>
  );

  const SortByDate = (
    <>
      sortByDate
      <label>
        <input type="radio" name="sortByDate" value="0" checked={dataStore.sortByDate === 0} />
        Off
      </label>
      <label>
        <input type="radio" name="sortByDate" value="1" checked={dataStore.sortByDate === 1} />
        Up
      </label>
      <label>
        <input type="radio" name="sortByDate" value="-1" checked={dataStore.sortByDate === -1} />
        Down
      </label>
    </>
  );

  const filterMoneyway = (
    <>
      filterMoneyway
      <label>
        <input
          type="radio"
          name="filterMoneyway"
          value="0"
          checked={dataStore.filterMoneyway === 0}
        />
        All
      </label>
      <label>
        <input
          type="radio"
          name="filterMoneyway"
          value="1"
          checked={dataStore.filterMoneyway === 1}
        />
        Income
      </label>
      <label>
        <input
          type="radio"
          name="filterMoneyway"
          value="-1"
          checked={dataStore.filterMoneyway === -1}
        />
        Outcome
      </label>
    </>
  );

  const DateFilter = ({ value }) => {
    // Явно нужен DateInput который можно переиспользовать.

    // собираюсь писать хендлеры...
    function DateInput({ value, name, handler }) {
      return (
        <input
          name={name}
          type="datetime-local"
          placeholder="date"
          value={getHTMLDate(value)}
          onChange={handler}
        />
      );
    }

    function setDateFilter({ target }) {
      dataStore.filterDate[target.name] = new Date(target.value).getTime();
      dataStore.selectTransactions();
      renderApp();
    }

    return (
      <>
        <DateInput value={value.start} name="firstDate" handler={setDateFilter} />
        <DateInput value={value.end} name="lastDate" handler={setDateFilter} />
      </>
    );
  };

  return (
    <div onchange={handler}>
      {SortBySum}
      <br />
      {SortByDate}
      <br />
      {filterMoneyway}
      <br />
      <DateFilter
        value={{ start: dataStore.filterDate.firstDate, end: dataStore.filterDate.lastDate }}
      />
    </div>
  );
}
