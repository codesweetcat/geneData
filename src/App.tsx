import React from "react";
import "./App.css";
// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

// import BarChartForGeneData from "./BarChartForGeneData"
import BarChartByRechart from "./graphChart/BarChartByRechart"
import RadarChartRechart from "./graphChart/RadarChartRechart"

import useFetch from "./hooks/useFetch";
import { getTopItemsByValue } from './utils/utils'


interface graphDataType {
  'name'?: string;
  'value'?: string;
}
interface newItemType {
  'symbol'?: string;
  'geneId'?: string;
  'name'?: string;
  'overall_association_score'?: string;
  'graphData'?: graphDataType[];
}
const transformFuc = (item: any) => {
  //extract relative elements to form a new object
  const container: newItemType = {}
  container['symbol'] = item['target']['gene_info']['symbol']
  container['geneId'] = item['target']['id']
  container['name'] = item['target']['gene_info']['name']
  container['overall_association_score'] = item['association_score']['overall']
  const graphDataObj = item['association_score']['datatypes']
  container['graphData'] = Object.keys(graphDataObj).map(k => {
    let itemObj: graphDataType = {};
    itemObj['name'] = k
    itemObj['value'] = graphDataObj[k]
    return itemObj
  })
  return container//append into a array as output
}



function App() {
  const url = 'https://demo6922545.mockable.io/'

  /***
 *Param1: Rest API link;
 *Param2: fuction: mutation  data
 *Param3: fucion: get overall top score data
 ** Output:
 * 1 new gene data and graph data pass to child
 * 2 network error message
 * 3 loading status
 */
  const { geneData, responseError, isLoading } = useFetch(url, transformFuc, getTopItemsByValue)

  if (isLoading) {
    return <p>loading </p>
  }
  if (responseError) {
    return <p>Network Error, try later </p>
  }

  return (
    <div className="App">
      <ReactTable
        data={geneData}
        columns=
        {[
          {
            expander: true,
            width: 65,
            Expander: ({ isExpanded, ...rest }) => (
              <div>
                {isExpanded ? (
                  <span>&#8722;</span>
                ) : (
                    <span>&#43;</span>
                  )}
              </div>
            ),
            style: {
              cursor: "pointer",
              fontSize: 25,
              color: "#8884d8",
              padding: "0",
              textAlign: "center",
              userSelect: "none"
            },
          },
          {
            Header: "Symbol",
            accessor: "symbol",
          },
          {
            Header: "Gene ID",
            accessor: "geneId",
          },
          {
            Header: "Gene Name",
            accessor: "name",
          },
          //Overall Association Score
          {
            Header: "Overall Association Score",
            accessor: "overall_association_score",
          },
        ]}
        defaultPageSize={10}
        className="-striped -highlight"
        SubComponent={(row) => {
          const graphData = row['original']['graphData']
          return (
            <div className={'rowGraph'}>
              <div className={'half'}>
                <BarChartByRechart data={graphData} />
              </div>
              <div className={'half'}>
                <RadarChartRechart data={graphData} title={'Association Score vs Data type'} />
              </div>
            </div>
          )
        }
        }
      />
    </div>
  );
}

export default App;
