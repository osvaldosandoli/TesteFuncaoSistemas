using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAtividadeEntrevista.Models
{
    public class BeneficiarioModel
    {

        [Key]
        public long Id { get; set; }

        [Required]
        public string CPF_bnf { get; set; }

        [Required]
        public string Nome_bnf { get; set; }

        public long ClienteId { get; set; }

        //[ForeignKey("ClienteId")]
        //public virtual Cliente Cliente { get; set; }
    }
}