import { useState, useEffect } from 'react'
import axios from "axios";

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

const useFetch = (url: string, transformFuc: (item: any) => newItemType, getTop: (transformedGenes: any[], numOfTop: number) => any[] | undefined) => {
    const [responseError, setResponseError] = useState(null)
    const [geneData, setGeneData] = useState<any[] | undefined>();
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchUsersWithAxios = async () => {
            const apiUrl = url
            let transformedGenes = [] as any[]
            setIsLoading(true)
            return axios
                .get(apiUrl)
                .then(({ data }) => {
                    data['data'].map((item: any) => {
                        return transformedGenes.push(transformFuc(item))//append into a array as output
                    })
                    setGeneData(getTop(transformedGenes, 5))//sort out and collect top 5
                    setIsLoading(false)
                })
                .catch(e => {
                    setResponseError(e)
                });
        };
        fetchUsersWithAxios();
    }, [url, transformFuc, getTop]);




    return {
        geneData,
        responseError,
        isLoading
    }

}


export default useFetch;