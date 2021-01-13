import { getTopItemsByValue } from '../utils/utils'
import axios from "axios";

export const fetchUsersWithAxios = async () => {
  const apiUrl = 'https://demo6922545.mockable.io/';
  let transformedGenes = []
  return axios
    .get(apiUrl)
    .then(({ data }) => {
      console.log('data', data)
      data['data'].map((item) => {
        const container = {}; //extract relative elements to form a new object
        container['symbol'] = item['target']['gene_info']['symbol']
        container['id'] = item['target']['id']
        container['name'] = item['target']['gene_info']['name']
        container['overall_association_score'] = item['association_score']['overall']
        const graphDataObj = item['association_score']['datatypes']
        container['graphData'] = Object.keys(graphDataObj).map(k => {
          let itemObj = {};
          itemObj['name'] = k
          itemObj['value'] = graphDataObj[k]
          return itemObj
        })
        return transformedGenes.push(container)//append into a array as output
      })
      return (getTopItemsByValue(transformedGenes, 5))//sort out and collect top 5
    })
    .catch((e) => {
      console.log(e);
    });
};