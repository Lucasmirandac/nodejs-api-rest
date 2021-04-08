const conexao = require('../infraestrutura/conexao')
const moment = require('moment')

class Atendimento{
    adiciona(atendimento, res){
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        const atendimentoDatado = {...atendimento, dataCriacao, data}
        const dataEValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteEValido = atendimento.cliente.length >= 4

        const validacoes = [
            {
                nome:'data',
                valido: dataEValida,
                mensagem: 'Data deve ser maior ou igual que a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteEValido,
                mensagem: 'Nome deve ter no mínimo 4 caracteres'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if(existemErros){
            res.status(400).json(erros)
        }
        else{
            const sql = 'INSERT INTO Atendimentos SET ?'
            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro)
            }
            else{
                res.status(201).json(atendimento)
            }
        })
        }
        
    }

    lista(res){
        const sql = 'SELECT * FROM Atendimentos'

        conexao.query(sql, (erro, resultados)=>{
            if (erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json(resultados)
            }
        })
    }

    buscaPorId(id,res){
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`
        conexao.query(sql, (erro, resultados)=>{
            if (erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json(resultados)
            }
        })
    }

    altera(id,valores,res){

        if(valores.data){
            valores.data = moment().format('YYYY-MM-DD HH:MM:SS')
        }

        const sql = 'UPDATE  Atendimentos SET ? WHERE id=?'

        conexao.query(sql, [valores,id], (erro, resultados)=>{
            if (erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json(...valores,id)
            }
        })
    }
    deleta(id, res){

        const sql = 'DELETE  Atendimentos WHERE id=${id}'

        conexao.query(sql, id, (erro, resultados)=>{
            if (erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json({id})
            }
        })
    }
}

module.exports = new Atendimento