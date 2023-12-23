const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedProducts() {
  const existingProducts = await prisma.product.findMany();
  const productToCreate = [
    {
      name: "QuantBlend",
      description:
        "QuantBlend é um Suplemento alimentar líquido que auxilia na digestão e no funcionamento do fígado. \n\nContém, em cada ml, extratos concentrados de carqueja em pó, hibisco em pó, alecrim em pó, boldo do chile em pó, capim limão em pó, cúrcuma em pó, matchá em pó, salsa em pó, abacaxi em pó, açaí em pó, chicória em pó, espinafre em pó, beterraba em pó, brócolis em pó, couve em pó, cloreto de colina.  \n\nQuantBlend é um produto especialmente desenvolvido para auxiliar o organismo a aumentar a produção de bile no fígado e sua liberação a partir da vesícula biliar, e ao mesmo tempo, a normalizar o processo digestivo alterado pela dispepsia (má digestão). \n\nO extrato concentrado de componentes vegetais QuantBlend, possui propriedades antioxidantes, imunoestimulantes e redutoras de lipídios. A Colina além de importante para o cérebro e músculos, é a vitamina aliada do fígado, que evita o acúmulo de triglicérides.",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image: "https://greenLife.s3.us-east-005.backblazeb2.com/QuantBlend.png",
      stock: 3,
    },
    {
      name: "QuantCaps Moro",
      description:
        "QuantCaps Moro contém o extrato de Laranja Moro e é um suplemento alimentar rico em nutrientes e substâncias bioativas que contribuem para o emagrecimento saudável.\nO extrato de Laranja Moro é rico em Antocianinas, especialmente as do tipo C3G que modificam o metabolismo das gorduras e estimulando hormônios da lipólise (queima de gordura).\n\n*Benefícios:*\n\n1 – Auxilia na redução de 25% a 50% da gordura abdominal\n2 – Menor acúmulo de gordura nos tecidos e estimula a queima da gordura\n3 – Potente ação antioxidante\n4 – Reduz Triglicérides e o Colesterol Total\n5 – Reduz a resistência a insulina\n6 – Contém Psyllium, que melhora o funcionamento do intestino e traz saciedade\n7 – Reduz os níveis de glicose no sangue\n8 – Contém Colágeno, garantindo firmeza e elasticidade para a pele\n9 – Contém o aminoácido L-fenilalanina, que auxilia em distúrbios neurológicos, depressão e déficit de memória\n10 – Diminui o apetite\n",
      price: 89.99,
      promotionPrice: 71.992,
      weight: 50,
      promotion: false,
      categoryId: 1,
      image:
        "https://greenLife.s3.us-east-005.backblazeb2.com/QuantCaps Moro.png",
      stock: 3,
    },
    {
      name: "QuantCaps Psyllium e Resveratrol",
      description:
        "Composto por Psyllium e Resveratrol + Vitamina C, Colina, Inulina e Cromo, promove o famoso “efeito Detox” ajudando a eliminar as toxinas e impurezas do organismo.\n\nO Psyllium é fonte riquíssima de fibra, ajudando a regular o intestino e melhorar o metabolismo. Tem grande capacidade de absorver água, ajudando a manter o intestino hidratado facilitando os movimentos peristálticos e com efeito laxante.\n\nO Resveratrol atua como um antioxidante natural, protegendo o organismo contra os danos causados pelos radicais livres \nAlém disso, tem efeitos na proteção cardiovascular, redução do colesterol ruim (LDL), melhora do desempenho atlético e, protege o organismo contra o surgimento de câncer e doenças degenerativas.\n\nA vitamina C auxilia na absorção do ferro dos alimentos, auxilia no metabolismo das gorduras e no funcionamento do sistema imune.\n\nA Colina contribui para o metabolismo da homocisteína e também no metabolismo lipídico.\n\nO Zinco auxilia no metabolismo da Vitamina A, no metabolismo de proteínas e gorduras, no processo de divisão celular, na manutenção celular e no sistema imune.\n\nO Cromo auxilia no metabolismo de gorduras, proteínas e carboidratos.\n",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image:
        "https://s3.us-east-005.backblazeb2.com/greenLife/Mockup_QuantCaps_Psyllium.png",
      stock: 3,
    },
    {
      name: "QuantCaps PinusPinaster",
      description:
        "O extrato de Pinus Pinaster, uma árvore também conhecida como Pinheiro-Bravo ou Pinheiro-Marítimo tem propriedades antioxidantes naturais e de extrema eficácia no auxílio ao tratamento de doenças circulatórias.\nAuxilia no tratamento e prevenção de veias varicosas, distúrbios do fluxo microcirculatório cerebral e cardíaco e reduz a fragilidade vascular.\nÉ rica em Omega 3, auxilia na manutenção da saúde da pele e na proteção contra os raios ultravioleta.\n\nBenefícios:\n- Antioxidante 50 vezes mais potente que a vitamina E e 20 vezes mais potente que a Vitamina C\n- Auxilia no tratamento de veias varicosas, distúrbios circulatórios, fragilidade vascular\n- Cardioprotetor, imunomodulador, anti-inflamatório e casos de artrite, proteção ocular\n- Anti-aging e tratamento do Melasma\n- Rica em Omega 3\n",
      price: 81.99,
      promotionPrice: 65.592,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image:
        "https://s3.us-east-005.backblazeb2.com/greenLife/Mockup_QuantCaps_Pinus.png",
      stock: 3,
    },
    {
      name: "QUANTION 01",
      description:
        "QUANTION 01 + Zinco + Vitamina A é um suplemento alimentar líquido que auxilia na prevenção de desordens intestinais, diabetes e proteção do sistema gastrointestinal.\n\nO produto apresenta em sua formulação o zinco na forma ionizada, o que faz este mineral ter uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nEm conjunto com a vitamina A, o zinco apresenta uma absorção ainda maior no organismo, sendo essencial para a chegada deste mineral em metaloenzimas de interesse que irão desencadear suas funções na proteção do sistema gastrointestinal, na regulação de índices de açúcares no sangue e no auxílio ao sistema digestivo. A vitamina A também desempenha um papel importante na manutenção das células do sistema imunológico que revestem a mucosa do intestino.\n",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image:
        "https://s3.us-east-005.backblazeb2.com/greenLife/QUANT%20ION%2001.jpg",
      stock: 3,
    },
    {
      name: "QUANTION 02",
      description:
        "QUANTION 02 + Magnésio + Vitamina C é um suplemento alimentar líquido que auxilia na saúde do sistema respiratório e na redução dos sintomas da asma.\n\nO produto apresenta em sua formulação o magnésio na forma ionizada, o que faz este mineral ter uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nO magnésio diminui os riscos de doenças crônicas de obstrução pulmonar, como a asma aguda.\n\nDesempenha também um papel importante na atividade neuromuscular, funções cardiovasculares e metabólicas. Estudos mostram uma associação entre magnésio, força muscular e desempenho no exercício.\n\nA vitamina C auxilia no funcionamento do sistema imune e na melhora de quadros de ataque de asma crônica e hipersensibilidade brônquica.",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image:
        "https://s3.us-east-005.backblazeb2.com/greenLife/QUANT%20ION%2002.jpg",
      stock: 3,
    },
    {
      name: "QUANTION 03",
      description:
        "QUANTION 03 Selênio + Vit. B3 + Taurina é um suplemento alimentar líquido que auxilia na manutenção da saúde cardiovascular.\n\nO produto apresenta em sua formulação o selênio na forma ionizada, o que faz este mineral ter uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nO selênio é um nutriente essencial para a prevenção de acidentes vasculares e trombose. Estudos já demonstraram associações entre os baixos níveis de selênio e o desenvolvimento de doenças cardiovasculares.\nQuanto menores os níveis de selênio, há uma maior predisposição a uma formação excessiva de plaquetas e agregação plaquetária. Esta condição leva a um aumento do aparecimento de doenças e de mortalidade cardiovascular.\nA deficiência de selênio também é uma das causas de anormalidades cardíacas, como a cardiomiopatia e o aumento de morte vascular em pacientes com angina pectoris aguda.\n",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image:
        "https://s3.us-east-005.backblazeb2.com/greenLife/QUANT%20ION%2003.jpg",
      stock: 3,
    },
    {
      name: "QUANTION 04",
      description:
        "QUANTION 04 Zinco + Vit. C + Lisina é um suplemento alimentar líquido que auxilia no fortalecimento da imunidade, especialmente contra infecções virais.\n\nO produto apresenta em sua formulação o zinco na forma ionizada, o que faz este mineral ter uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nO zinco é o mineral com maior efeito sobre o sistema imunológico e a deficiência desse mineral prejudica a atividade de várias células do sistema imune e a formação de algumas substâncias necessárias para o combate a microrganismos invasores.\n\nJuntamente com o zinco, a vitamina C auxilia na manutenção do funcionamento do sistema imunológico e, devido à sua capacidade antioxidante, protege as células contra a ação dos radicais livres. Sua suplementação é necessária para o funcionamento e movimentação dos glóbulos brancos, bem como para o processo de eliminação dos agentes invasores\n",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image: "",
      stock: 3,
    },
    {
      name: "QUANTION 05",
      description:
        "QUANTION 05 Cálcio + Vitamina D3 é um suplemento alimentar líquido que auxilia na manutenção da saúde de ossos e dentes.\n\nO produto apresenta em sua formulação o cálcio na forma ionizada, o que faz este mineral ter uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nO cálcio é o principal mineral do esqueleto e um dos íons mais abundantes e importantes do organismo.\n\nAtua na prevenção do raquitismo, da osteomalácia, da osteopenia e da osteoporose.\n\nEnquanto a principal função da vitamina D é estimular a absorção do cálcio pelo organismo, combatendo também a fraqueza muscular, perda severa dos dentes e desordens cardiovasculares.",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image:
        "https://s3.us-east-005.backblazeb2.com/greenLife/QUANT%20ION%2005.jpg",
      stock: 3,
    },
    {
      name: "QUANTION 06",
      description:
        "QUANTION 06 Zinco + Magnésio + Vit. B6 é um suplemento alimentar líquido que auxilia na regulação do sistema hormonal da mulher, contribuindo para sua saúde e para a redução dos sintomas da TPM.\n\nO produto apresenta em sua formulação o zinco e o magnésio na forma ionizada, o que faz estes minerais terem uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\n\nA tensão pré-menstrual (TPM) é causada por uma alteração hormonal que interfere no sistema nervoso central, afetando a produção de endorfina e serotonina.  Por isso, é comum a ocorrência de alterações de humor como ansiedade, irritabilidade, nervosismo, depressão, insônia e hiperatividade.\n\nO magnésio e a piridoxina são fundamentais para a formação de serotonina, eficaz na redução de crises de abstinência e na prevenção dos sintomas associados à tensão pré-menstrual. \n\nAs mudanças hormonais que ocorrem na fase da TPM também podem contribuir para o aparecimento de acne, e o zinco é o que mais se destaca para a redução da acne. O zinco também é necessário para a regulação da liberação e da atividade de diversos hormônios corporais, incluindo os hormônios sexuais. ",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image:
        "https://s3.us-east-005.backblazeb2.com/greenLife/QUANT%20ION%2006.jpg",
      stock: 3,
    },
    {
      name: "QUANTION 07",
      description:
        "QUANTION 07 Magnésio + Selênio + Vit. B1 + Vit. B5 é um suplemento alimentar líquido que auxilia na manutenção da saúde cerebral e neuromuscular.\n\nO produto apresenta em sua formulação o magnésio e o selênio na forma ionizada, o que faz estes minerais terem uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nA suplementação de magnésio auxilia na melhora da capacidade cognitiva evitando a rápida deterioração da memória em indivíduos durante o envelhecimento. O magnésio também é importante para a produção de serotonina, auxiliando na regulação do humor, e reduzindo sintomas de ansiedade, depressão, insônia e irritabilidade.\n\nO selênio atua principalmente como neuro protetor, prevenindo o aparecimento de patologias como demência e doença de Alzheimer.\n\nAs vitaminas B1 e B5 também desempenham importante papel no funcionamento cerebral evitando as alterações no humor, especialmente ansiedade, irritabilidade, agitação e distúrbios do sono. O ácido pantotênico contribui para o funcionamento neuromuscular.",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image: "",
      stock: 3,
    },
    {
      name: "QUANTION 08",
      description:
        "QUANTION 08 Iodo + Vit. A é um suplemento alimentar líquido, que auxilia na manutenção da saúde da tireoide, através da correta produção e secreção dos hormônios tireoidianos.\n\nO produto apresenta em sua formulação o iodo na forma ionizada, o que faz este mineral ter uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nA glândula tireoide aumenta a captação do Iodo e produz enzimas que reagem, resultando na liberação dos hormônios tireoidianos na circulação.\n\nTraz como benefícios da melhora a função imune e diminuição da incidência de câncer gástrico.\n\nJuntamente com o iodo, a suplementação com vitamina A auxilia na redução do risco de bócio e de suas sequelas.",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image:
        "https://s3.us-east-005.backblazeb2.com/greenLife/QUANT%20ION%2008.jpg",
      stock: 3,
    },
    {
      name: "QUANTION 09",
      description:
        "QUANTION 09 Complexo B + Magnésio é um suplemento alimentar líquido que auxilia na redução da ansiedade e do estresse.\n\nO produto apresenta em sua formulação o magnésio na forma ionizada, o que faz estes minerais terem uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nAs vitaminas do complexo B combatem o estresse e estimulam os hormônios do bem estar, como a serotonina e dopamina. A tiamina e o ácido pantotênico melhoram o funcionamento do cérebro, a redução da fadiga, ansiedade e irritabilidade. A piridoxina também contribui para a regulação do humor e alívio dos sintomas de estresse.\n\nO magnésio é fundamental para a formação de serotonina, considerado um estabilizador natural do humor. Auxilia no combate das alterações de humor, ansiedade, irritabilidade, nervosismo, depressão, insônia e hiperatividade. \n\nO magnésio auxilia na redução de dores de cabeça tensionais e dos sintomas associados a crises de abstinência, restrição de cafeína, na prevenção de sintomas associados à tensão pré-menstrual (TPM) e dismenorreia.",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image:
        "https://s3.us-east-005.backblazeb2.com/greenLife/QUANT%20ION%2009.jpg",
      stock: 3,
    },
    {
      name: "QUANTION 10",
      description:
        "QUANTION 10 Selênio + Vit. B3 + Arginina é um suplemento alimentar líquido que auxilia na manutenção da saúde do homem, especialmente em casos de infertilidade e disfunção erétil.\n\nO produto apresenta em sua formulação o selênio na forma ionizada, o que faz este mineral ter uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nO selênio é um mineral com importante ação antioxidante, com atuação em todas as células, inclusive nos espermatozoides. Considerando, que, a concentração de selênio no sistema reprodutor masculino influencia a saúde dos espermatozoides e a redução do estresse oxidativo, a deficiência desse mineral pode levar a alterações na fertilidade.  \n\nGrande parte dos casos de disfunção erétil em homens entre 40 e 70 anos está relacionada a altos níveis de colesterol e doenças cardiovasculares, como disfunção endotelial e aterosclerose.\n\nAlém disso, a niacina induz a liberação de prostaglandina D2, substância necessária para que ocorra a vasodilatação no corpo cavernoso do pênis, melhorando a função erétil.",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image:
        "https://s3.us-east-005.backblazeb2.com/greenLife/QUANT%20ION%2010.jpg",
      stock: 3,
    },
    {
      name: "QUANTION 11",
      description:
        "QUANTION 11 Magnésio + Vit. D3 é um é um suplemento alimentar líquido que auxilia na manutenção da saúde renal.\n\nO produto apresenta em sua formulação o magnésio na forma ionizada, o que faz este mineral ter uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nA deficiência de magnésio pode estar relacionada à formação de cristais na urina e consequentemente de cálculos renais (litíase).  \n\nA suplementação com magnésio auxilia na melhora do quadro, por ser um mineral alcalino e que regula o pH sanguíneo.\n\nEm conjunto com o magnésio, a vitamina D3 também auxilia na prevenção de cálculos renais, uma vez que o cálcio é dependente dessa vitamina para sua absorção. Corretos níveis de vitamina D3 sanguíneos garantem o transporte do cálcio ingerido para os ossos, impedindo que ele se deposite nas artérias e nos rins.",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image: "",
      stock: 3,
    },
    {
      name: "QUANTION 12",
      description:
        "QUANTION 12 Vit. B6 + Vit. D3 + Magnésio é um suplemento alimentar líquido que auxilia na redução de dores musculares crônicas, especialmente em casos de fibromialgia.\n\nO produto apresenta em sua formulação o magnésio na forma ionizada, o que faz este mineral ter uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nO Magnésio melhora a atividade elétrica cardíaca, a contratilidade muscular e o funcionamento das células nervosas. \n\nDiminui a tensão muscular intensa e dor generalizada no corpo e aumenta o relaxamento dos músculos.\n\nA vitamina D3 e a vitamina B6, agem no aumento do intervalo e na diminuição das dores crônicas, especialmente a fibromialgia.\n",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image:
        "https://s3.us-east-005.backblazeb2.com/greenLife/QUANT%20ION%2012.jpg",
      stock: 3,
    },
    {
      name: "QUANTION 13 ",
      description:
        "QUANTION 13 Multiminerais ionizados é um suplemento alimentar líquido que reúne os minerais e vitaminas necessárias para o bom funcionamento do nosso organismo.\n\nO produto apresenta em sua formulação os minerais zinco, magnésio, cobre, selênio, fósforo, cromo, molibdênio e iodo em suas formas ionizadas, o que faz com que eles tenham uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nAlém dos minerais, a formulação também apresenta as vitaminas do complexo B e a vitamina C. Juntos, esses nutrientes participam de diversos processos fisiológicos e metabólicos no organismo: \n\n- Auxílio no metabolismo de carboidratos, proteínas e gorduras; \n\n- Produção de energia para o dia a dia;\n\n- Fortalecimento do sistema imunológico e proteção contra doenças infecciosas;\n\n- Proteção contra os danos causados pelos radicais livres e envelhecimento precoce;\n\n- Fortalecimento das unhas e cabelos;\n\n- Melhora da memória e das funções cognitivas; \n\n- Redução do estresse e da sensação de cansaço generalizado.",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image: "",
      stock: 3,
    },
    {
      name: "QUANTION 14 ",
      description:
        "QUANTION 14 Cobre + Zinco + Vit. B2 + Vit. C é um suplemento alimentar líquido com potente atividade antioxidante, auxiliando no combate aos danos causados pelos radicais livres, prevenindo o envelhecimento precoce e doenças provocadas pelo estresse oxidativo.\n\nO produto apresenta em sua formulação os minerais cobre e zinco em suas formas ionizadas, o que faz com que eles tenham uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nCombate os radicais livres, cuja ação nos faz envelhecer e pode ser responsável por mal funcionamento do sistema imunológico, doenças degenerativas e câncer.\n\nÉ importante a suplementação de nutrientes que sejam capazes de neutralizar e eliminar esses radicais livres formados durante a nossa respiração, evitando que eles se acumulem no organismo e provoquem uma condição chamada de estresse oxidativo.\n\nAs vitaminas e os minerais presentes nesta formulação possuem um alto potencial antioxidante e atuam em diversas vias metabólicas. Esses nutrientes são capazes de reagir com os próprios radicais livres, transformando-os em moléculas menos reativas, que causam menos danos ao organismo e são mais facilmente eliminadas pelos rins.",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image:
        "https://s3.us-east-005.backblazeb2.com/greenLife/QUANT%20ION%2014.jpg",
      stock: 3,
    },
    {
      name: "QUANTION 15",
      description:
        "QUANTION 15 Ferro + Vit. B9 + Vit. B12 é um suplemento alimentar líquido que auxilia na redução dos sintomas em casos de anemia.\n\nO produto apresenta em sua formulação o ferro na forma ionizada, o que faz este mineral ter uma maior biodisponibilidade, melhor absorção e melhor resposta biológica.\n\nEstados de deficiência de ferro caracterizam a anemia por carência de ferro, ou anemia ferropriva. Nesse caso, é comum o aparecimento de sintomas como cansaço generalizado tonturas, dor de cabeça, falta de concentração, irritabilidade e confusão mental. A ocorrência de fadiga muscular frequente também é bem comum, devido à má formação e mal funcionamento da mioglobina. \n\nEntretanto, apesar da deficiência de ferro ser apontada como a principal causa da anemia, grande parte das anemias nutricionais resultam não só da carência de ferro, mas também de ácido fólico (vitamina B9) e vitamina B12. A deficiência dessas duas vitaminas causa outro tipo de anemia, chamada anemia megaloblástica, onde a medula óssea produz glóbulos vermelhos grandes e anormais, incapazes de transportar corretamente o oxigênio pelo sangue, e acarretando nos mesmos sintomas da anemia ferropriva.",
      price: 69.9,
      promotionPrice: 55.92,
      weight: 60,
      promotion: false,
      categoryId: 1,
      image:
        "https://s3.us-east-005.backblazeb2.com/greenLife/Quant%20Ion%2015.png",
      stock: 3,
    },
  ].filter((product) => !existingProducts.some((s) => s.name === product.name));

  if (productToCreate.length > 0) {
    for (const product of productToCreate) {
      await prisma.product.create({
        data: product,
      });
    }
  }
}

module.exports = seedProducts;
