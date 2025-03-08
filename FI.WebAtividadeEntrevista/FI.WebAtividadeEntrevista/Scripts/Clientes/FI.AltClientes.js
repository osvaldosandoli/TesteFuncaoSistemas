
$(document).ready(function () {
    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);

        if (obj.Beneficiarios) {
            ListarBeneficiarios(obj.Beneficiarios);
        }

    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        var cpf_cli_format = $(this).find("#CPF").val();
        cpf_cli_format = cpf_cli_format.replace(/[^\d]/g, '');

        console.log($(this).find("#CPF").val());
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": cpf_cli_format,
                "Beneficiarios": $("tr.beneficiario").map(function () {
                    var cpf_bnf_format = $(this).find("td.cpf_bnf").text().trim();
                    return {
                        "CPF_bnf": cpf_bnf_format.replace(/[^\d]/g, ''), //realizando a formatação deixando apenas os numeros do CPF (Beneficiario)
                        "Nome_bnf": $(this).find("td.nome_bnf").text().trim()
                    };
                }).get()
            },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r)
                    $("#formCadastro")[0].reset();
                    window.location.href = urlRetorno;
                }
        });
    });
    function ListarBeneficiarios(beneficiarios) {
        let html = "";
        beneficiarios.forEach(function (beneficiario) {
            html += `<tr class="beneficiario">           
                                    <td class="benNm_form cpf_bnf">${beneficiario.CPF_bnf}</td>
                                    <td class="benCPF_form nome_bnf">${ beneficiario.Nome_bnf}</td>
                                    <td>
                    <button class="btn btn-primary btnAlterar editarBeneficiario">Alterar</button>
                    <button class="btn btn-primary btnExcluir ">Excluir</button>
                                    </td>
                    </tr>`;
        });
        $("#tabelaBeneficiarios").html(html); // Insere os dados no HTML


    }

    $(document).on("click", "#btnIncluir", function () {
        //$("#tabelaBeneficiarios").append(newRow);
        //$("#cpfBnf").val('');
        //$("#nomeBeneficiario").val('');
        console.log(obj.Beneficiarios);
    });

    $(document).on("click", ".editarBeneficiario", function () {
        linhaEditando = $(this).closest("tr"); // Guarda a linha que está sendo editada

        // Preenche os campos do formulário com os valores da linha
        $("#CPF_bnf").val(linhaEditando.find(".cpf_bnf").text());
        $("#nome_bnf").val(linhaEditando.find(".nome_bnf").text());


        $(this).closest("tr").remove();
    });

    // Function para remover o beneficiário da tabela
    $(document).on("click", ".removerBeneficiario", function () {
        $(this).closest("tr").remove();
    });


});

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}



