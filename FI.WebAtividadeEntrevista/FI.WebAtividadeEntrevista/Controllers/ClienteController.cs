using FI.AtividadeEntrevista.BLL;
using WebAtividadeEntrevista.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using FI.AtividadeEntrevista.DML;
using System.Text.RegularExpressions;

namespace WebAtividadeEntrevista.Controllers
{
    public class ClienteController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Incluir()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Incluir(ClienteModel model)
        {
            Console.WriteLine(model.Beneficiarios);

            BoCliente bo = new BoCliente();
            BoBeneficiario be = new BoBeneficiario();
            


            if (!ValidarCPF(model.CPF) || (model.Beneficiarios != null && model.Beneficiarios.Any(x => !ValidarCPF(x.CPF_bnf))))
            {
                Response.StatusCode = 400;
                return Json("Erro: CPF inválido");
            }

            if (VerrificaCPF(model.CPF))
            {
                Response.StatusCode = 400;
                return Json("Erro: CPF já cadastrado");
            }

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            else
            {

                model.Id = bo.Incluir(new Cliente()
                {                    
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                });


                if (model.Beneficiarios != null && model.Beneficiarios.Count() > 0)
                {
                    foreach (BeneficiarioModel ben in model.Beneficiarios)
                    {
                        be.Incluir(new Beneficiario()
                        {
                            Nome = ben.Nome_bnf,
                            CPF = ben.CPF_bnf,
                            ClienteId = model.Id
                        });
                    }
                }

                return Json("Cadastro alterado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult Alterar(ClienteModel model)
        {
            BoCliente bo = new BoCliente();
            BoBeneficiario be = new BoBeneficiario();
            var consult = be.Consultar(model.Id);

            if (!ValidarCPF(model.CPF) || (model.Beneficiarios != null && model.Beneficiarios.Any(x => !ValidarCPF(x.CPF_bnf))))
            {
                Response.StatusCode = 400;
                return Json("Erro: CPF inválido");
            }

            if (VerrificaCPF(model.CPF))
            {
                Response.StatusCode = 400;
                return Json("Erro: CPF já cadastrado");
            }

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }

            else
            {
                if (model.CPF.Length >= 14)
                {
                    model.CPF = Regex.Replace(model.CPF, @"[.\-]", "");

                }

                bo.Alterar(new Cliente()
                {
                    Id = model.Id,
                    CEP = model.CEP,
                    Cidade = model.Cidade,
                    Email = model.Email,
                    Estado = model.Estado,
                    Logradouro = model.Logradouro,
                    Nacionalidade = model.Nacionalidade,
                    Nome = model.Nome,
                    Sobrenome = model.Sobrenome,
                    Telefone = model.Telefone,
                    CPF = model.CPF
                   
                });


                if (model.Beneficiarios != null && model.Beneficiarios.Count() > 0)
                {
                    if (consult != null && consult.Count() > 0)
                    {
                        be.Excluir(model.Id);
                    }


                    foreach (BeneficiarioModel ben in model.Beneficiarios)
                    {
                        be.Incluir(new Beneficiario()
                        {
                            Nome = ben.Nome_bnf,
                            CPF = ben.CPF_bnf,
                            ClienteId = model.Id
                        });
                    }
                }

                return Json("Cadastro efetuado com sucesso");

            }
        }

        [HttpGet]
        public ActionResult Alterar(long id)
        {
            BoCliente bo = new BoCliente();
            Cliente cliente = bo.Consultar(id);
            Models.ClienteModel model = null;

            BoBeneficiario be = new BoBeneficiario();
           
            List<BeneficiarioModel> listaBeneficiario = new List<BeneficiarioModel>();
            var consulta = be.Consultar(cliente.Id);
            consulta.ForEach(x => listaBeneficiario.Add(new BeneficiarioModel { Nome_bnf = x.Nome, CPF_bnf = x.CPF, Id = x.Id, ClienteId = cliente.Id }));



            if (cliente != null)
            {
                model = new ClienteModel()
                {
                    Id = cliente.Id,
                    CEP = cliente.CEP,
                    Cidade = cliente.Cidade,
                    Email = cliente.Email,
                    Estado = cliente.Estado,
                    Logradouro = cliente.Logradouro,
                    Nacionalidade = cliente.Nacionalidade,
                    Nome = cliente.Nome,
                    Sobrenome = cliente.Sobrenome,
                    Telefone = cliente.Telefone,
                    CPF = cliente.CPF,
                    Beneficiarios = listaBeneficiario  
                };

            }

            return View(model);
        }


        [HttpPost]
        public JsonResult ClienteList(int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                int qtd = 0;
                string campo = string.Empty;
                string crescente = string.Empty;
                string[] array = jtSorting.Split(' ');

                if (array.Length > 0)
                    campo = array[0];

                if (array.Length > 1)
                    crescente = array[1];

                List<Cliente> clientes = new BoCliente().Pesquisa(jtStartIndex, jtPageSize, campo, crescente.Equals("ASC", StringComparison.InvariantCultureIgnoreCase), out qtd);

                //Return result to jTable
                return Json(new { Result = "OK", Records = clientes, TotalRecordCount = qtd });
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
        }

        //Método para validar CPF
        public static bool ValidarCPF(string cpf)
        {
            if (string.IsNullOrWhiteSpace(cpf))
                return false;

            cpf = new string(cpf.Where(char.IsDigit).ToArray());

            if (cpf.Length != 11 || cpf.Distinct().Count() == 1)
                return false;

            int[] multiplicador1 = { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

            string tempCpf = cpf.Substring(0, 9);
            int soma = 0;

            for (int i = 0; i < 9; i++)
                soma += (tempCpf[i] - '0') * multiplicador1[i];

            int resto = (soma * 10) % 11;
            if (resto == 10) resto = 0;

            if (resto != (cpf[9] - '0'))
                return false;

            tempCpf += resto;
            soma = 0;

            for (int i = 0; i < 10; i++)
                soma += (tempCpf[i] - '0') * multiplicador2[i];

            resto = (soma * 10) % 11;
            if (resto == 10) resto = 0;

            return resto == (cpf[10] - '0');
        }

        public static bool VerrificaCPF(string cpf)
        {
            BoCliente dao = new BoCliente();
            bool existe = dao.VerificarExistencia(cpf);

            if(existe == true)
            {
                return true;
            }
            return false;
        }

    }
}