interface item {
  Id: string;
  children: item[];
  key: string;
  label: string;
}

/**
 * Функция-построитель древовидного списка из плоского
 *
 * Функция принимает плоский список плоский список объектов с указанием родительского
 * элемента и возвращает список объектов с вложенными в свойство children потомками.
 * @param {unknown[]} list - массив объектов, которые вы хотите преобразовать в дерево
 * @returns Древовидная структура.
 */
export default function treeFromList(
  list: item[],
  parentIdField: string,
  keyField?: string,
  labelField?: string,
) {
  let node: item;
  let i: number;

  const map: { [key: string]: number } = {};
  const roots: item[] = [];

  // Пройдем по списку
  for (i = 0; i < list.length; i += 1) {
    map[list[i].Id] = i; // составим карту
    list[i].children = []; // добавим свойство для потомков (нодов)
    if (keyField) list[i].key = list[i][keyField];
    if (labelField) list[i].label = list[i][labelField];
  }

  // Пройдемся по списку
  for (i = 0; i < list.length; i += 1) {
    node = list[i]; // текущий элемент
    const findedParent = list.find((item) => node[parentIdField] === item.Id);

    if (findedParent) {
      // если это не корневой элемент и найден родитель,
      // то в карте по Id родителя найдем его index в списке
      // по index возьмем элемент из списка и в его потомки добавим
      // текущий элемент
      list[map[node[parentIdField]]].children.push(node);
    } else if (node[parentIdField] !== null) {
      roots.push(node); // положим его в общий массив
    } else {
      // если это корневой элемент
      roots.push(node); // положим его в общий массив
    }
  }

  return roots;
}
