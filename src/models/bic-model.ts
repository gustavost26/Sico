export interface BoletimInformacaoClinica {
  idBic?: string;
  idCivil?: number;
  nUtente?: number;
  nome?: string;
  nomePai?: string;
  nomeMae?: string;
  profissao?: string;
  chkProfissaoDesconhecida?: boolean;
  sexo?: string;
  dataNascimento?: string;
  diaNascimento?: string;
  mesNascimento?: string;
  anoNascimento?: string;
  estadoCivil?: string;
  pais?: string;
  distrito?: string;
  concelho?: string;
  freguesia?: string;
  tipoContacto?: string;
  contactoFamiliar?: string;
  infoAdmissao?: string;
  resCovid19?: string;
  transferidoDe?: string;
  dataAdmissaoLocalTransf?: string;
  admitidoInstSaude?: any;
  dataAdmissao?: string;
  horaAdmissao?: string;
  chegouCadaver?: any;
  dataFalecido?: string;
  diaFalecido?: string;
  mesFalecido?: string;
  anoFalecido?: string;
  horaFalecido?: string;
  dataObito?: string;
  diaObito?: string;
  mesObito?: string;
  anoObito?: string;
  horaObito?: string;
  situacaoClinica?: string;
  internamentoEnf?: string;
  evolucaoClinica?: string;
  examesComplementares?: string;
  antecedentesGerais?: string;
  diagnostico?: string;
  terapeuticas?: string;
  prodBio?: string;
  vestigios?: string;
  outrosElementos?: string;
  observacoes?: string;
  medicoNome?: string;
  medicoTipoContacto?: string;
  medicoContacto?: string;
  medicoCedulaProf?: string;
  operacao?: string;
  msgConfirmacao?: string;
  gravar?: string;
  idCO?: string;
  tipoCO?: string;
  numCO?: string;
  titulo?: string;
  numBic?: string;
  dataEmissaoComHora?: string;
  dataEmissao?: string;
  horaEmissao?: string;
  versaoCertificado?: string;
  tipoMoradaProfissional?: any;
  moradaProfissionalOutro?: string;
  tipoEntidade?: Number;
  codigoSaudeProfissional?: string;
  codigoInmlProfissional?: string;
  tipoServico?: any;
  servicoOutro?: string;
  medicoTipoContactoDesc?: any;
  tipoServicoDesc?: any;
  codigoSaudeProfissionalDesc?: any;
  codigoInmlProfissionalDesc?: any;
  tipoEntidadeDesc?: any;
  tipoMoradaProfissionalDesc?: any;
  chegouCadaverDesc?: any;
  admitidoInstSaudeDesc?: any;
  tipoContactoDesc?: any;
  freguesiaDesc?: any;
  concelhoDesc?: any;
  distritoDesc?: any;
  paisDesc?: any;
  estadoCivilDesc?: any;
  sexoDesc?: any;
  nutente?: any;
}