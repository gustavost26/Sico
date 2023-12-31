export interface CertificadoObitoFetal {
  idCOFetal?: number;
  conservatoriaDistrito?: string;
  conservatoriaConcelho?: string;
  conservatoriaDesc?: string;
  conservador?: string;
  numRegisto?: string;
  dataRegisto?: string;
  numCertificado?: string;
  versaoCertificado?: string;
  nome?: string;
  nomePai?: string;
  nomeMae?: string;
  numBI?: string;
  numUtente?: string;
  capituloCmA?: string;
  grupoCmA?: string;
  categoriaCmA?: string;
  subCategoriaCmA?: string;
  outroCmA?: string;
  tempoCmA?: string;
  unidTemporalCmA?: string;
  capituloCmB?: string;
  grupoCmB?: string;
  categoriaCmB?: string;
  subCategoriaCmB?: string;
  outroCmB?: string;
  tempoCmB?: string;
  unidTemporalCmB?: string;
  capituloCmC?: string;
  grupoCmC?: string;
  categoriaCmC?: string;
  subCategoriaCmC?: string;
  outroCmC?: string;
  tempoCmC?: string;
  unidTemporalCmC?: string;
  capituloCmD?: string;
  grupoCmD?: string;
  categoriaCmD?: string;
  subCategoriaCmD?: string;
  outroCmD?: string;
  outroCmE?: string;
  tempoCmD?: string;
  unidTemporalCmD?: string;
  numCodu?: string;
  tipoObito?: string;
  tipoObitoSelected?: string;
  tipoObitoNaoNatural?: string;
  tipoObitoNatural?: string;
  descOutroAcidente?: string;
  sexo?: string;
  estadoNasc?: string;
  chkNascDesconhecida?: boolean;
  chkObitoDesconhecida?: boolean;
  chkHoraObitoDesconhecida?: boolean;
  chkNascMorta?: boolean;
  nascimentoViva?: string;
  nascimentoDiaViva?: string;
  nascimentoMesViva?: string;
  nascimentoAnoViva?: string;
  horaNascimentoViva?: string;
  dataObitoCrianca?: string;
  diaMorte?: string;
  mesMorte?: string;
  anoMorte?: string;
  horaMorte?: string;
  nascimentoMorta?: string;
  nascimentoDiaMorta?: string;
  nascimentoMesMorta?: string;
  nascimentoAnoMorta?: string;
  momentoMorte?: string;
  baseCausaMorte?: string;
  dataAutopsia?: string;
  horaAutopsia?: string;
  numProcessoAutopsia?: string;
  peso?: string;
  pesoIgnorado?: string;
  localObito?: string;
  idHospitalObito?: string;
  txt_ho_scoreApgar1?: string;
  txt_ho_scoreApgar5?: string;
  txt_ho_scoreApgar10?: string;
  chkIndiceApgarDesconhecido?: string;
  classificacaoMorte?: string;
  classificacaoMorteMalf?: string;
  idHospitaisObito?: string;
  idUACObito?: string;
  idOutroObito?: string;
  descLocalObito?: string;
  partoGemeos?: string;
  inumacaoCremacao?: string;
  motivoInumCrem?: string;
  doencaInfeciosa?: string;
  dataParto?: string;
  dataObito?: string;
  localParto?: string;
  tipoEntidadeParto?: number;
  idHospitalParto?: string;
  descLocalParto?: string;
  assistencia?: string;
  naturezaParto?: string;
  numGemeos?: string;
  numNadosVivos?: string;
  numFetosMortos?: string;
  tipoParto?: string;
  outroTipoParto?: string;
  duracaoGravidez?: string;
  duracaoGravidezIgnorado?: string;
  descDuracaoMotivo?: string;
  vigilanciaAntenatal?: string;
  indPrimeiraConsulta?: string;
  focoFetal?: string;
  chkFocoFetalDesconhecido?: string;
  duracaoParto?: string;
  chkDuracaoPartoDesconhecido?: string;
  // dados relativos à mãe do feto ou criança
  dataNascimentoMae?: string;
  dataPartoAnterior?: string;
  numPartosTermo?: string;
  numPartosPreTermo?: string;
  numAbortos?: string;
  numFilhosVivos?: string;
  residenciaMorada?: string;
  residenciaDistrito?: string;
  residenciaConcelho?: string;
  residenciaFreguesia?: string;
  residenciaPais?: string;
  patologias?: string;
  cbPatHipArt?: string;
  cbPatDiaGes?: string;
  cbPatDiaMel1?: string;
  cbPatDiaMel2?: string;
  cbPatDoeMental?: string;
  cbPatDoeNeuro?: string;
  cbPatInfTransSex?: string;
  cbPatObesidade?: string;
  cbPatOutra?: string;
  patOutraDesc?: string;
  goodwin?: string;
  vigilCSPrimarios?: string;
  vigilCSHospitalares?: string;
  vigilObstPriv?: string;
  vigilVPart?: string;
  cbSemVigilancia?: boolean;
  cbVigilDesconhecida?: boolean;
  observacoes?: string;
  observacoesInfoClinica?: string;
  nomeClinico?: string;
  codigoInmlProfissional?: string;
  codigoSaudeProfissional?: string;
  moradaClinico?: string;
  numCedulaProfissional?: string;
  tipoContacto?: string;
  descContacto?: string;
  dataEmissao?: string;
  horaEmissao?: string;
  nuipc?: string;
  numBIC?: string;
  operacao?: string;
  cmConfidenciais?: string;
  estadoIRN?: string;
  dataEstadoIRN?: string;
  estadoINE?: string;
  dataEstadoINE?: string;
  estadoRNU?: string;
  dataEstadoRNU?: string;
  mensagemIRN?: string;
  mensagemRNU?: string;
  mensagemINE?: string;
  // Novos estados de envio
  novoEstadoIRN?: string;
  novoEstadoRNU?: string;
  novoEstadoINE?: string;
  tempoA?: string;
  unidTempoA?: string;
  tempoB?: string;
  unidTempoB?: string;
  tempoC?: string;
  unidTempoC?: string;
  tempoD?: string;
  unidTempoD?: string;
  tempoE?: string;
  unidTempoE?: string;
  freguesiaLocalObito?: string;
  concelhoLocalObito?: string;
  distritoLocalObito?: string;
  paisLocalObito?: string;
  dispensaAutopsia?: string;
  estadoDecisaoMP?: string;
  utilizadorAlteracaoMP?: string;
  chkMoradaRDesconhecida?: boolean;
  chkPaisRDesconhecida?: boolean;
  chkDistritoRDesconhecida?: boolean;
  chkConcelhoRDesconhecida?: boolean;
  chkFreguesiaRDesconhecida?: boolean;
  idServicoObito?: string;
  descServicoObitoOutro?: string;
  idMoradaProfissionalServicoObito?: string;
  descMoradaProfissionalServicoOutro?: string;
  ativarCid?: string;
  selectEntidadeObito?: number;
  selectEntidade?: number;
  tipoEntidadeSelecionada?: string;
}
