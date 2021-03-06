import { fmtDate } from './Util'

/**
 * 
 * @function
 * @description Returns the file's header
 * @param {array} data - File content
 * @returns {string} The header content
 */
export const getHeader = (data) => `${data[0]}${data[1]}`

const getSegmentT = (record) => {
    return {
        codigo_movimentacao: record.substring(15, 17),
        numero_registro: record.substring(8, 13),
        nosso_numero: record.substring(37, 57).trim(),
        data_vcto: fmtDate(record.substring(73, 81)),
        valor_titulo: record.substring(81, 96) / 100,
        seu_numero: record.substring(105, 130).trim()
    }
}

const getSegmentU = (record) => {
    return {
        numero_registro: record.substring(8, 13),
        juros: record.substring(17, 32) / 100,
        desconto_concedido: record.substring(32, 47) / 100,
        valor_pago: record.substring(77, 92) / 100
    }
}

/**
 * 
 * @function
 * @description Returns the records with T and U segments
 * @param {array} data - File content
 * @returns {array} Returns an array with all formated objects
 */
export const getRecords = (data) => {
    const records = []
    const only_records = data.filter( record => ['T', 'U'].includes(record.substring(13, 14)) )

    for ( let i = 0, aux = 0, len = only_records.length; i < len; i++ ) {
        if ( only_records[i].substring(13, 14) === 'T' ) {
            records[aux] = getSegmentT(only_records[i])
        } else {
            records[aux] = Object.assign(records[aux], getSegmentU(only_records[i]))
            aux++
        }
    }
    
    return records
}