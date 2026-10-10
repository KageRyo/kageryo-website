export default {
  meta: {
    home: {
      title: "Chien-Hsun Chang {'|'} バックエンド・プラットフォーム・AI システム",
      description: '国立中正大学の修士課程で学ぶ Chien-Hsun Chang のポートフォリオ。バックエンド、プラットフォーム、AI システム、MLOps、KServe へのコントリビュート、スマート防災デジタルツイン、AI 映像解析、国際連携の連合学習を紹介します。',
    },
    about: {
      title: 'KageRyo Developer - 私について',
      description: 'Chien-Hsun Chang の学歴、職務経歴、スキル、オープンソースへの貢献を紹介します。',
    },
    projects: {
      title: 'KageRyo Developer - プロジェクト',
      description: 'KServe へのコントリビュート、スマート防災デジタルツインシステム（TAG-Twin）、AI 環境違反取締り映像解析システム、国際連携・連合学習による空気質分析・デプロイ基盤などの注目プロジェクトと GitHub のオープンソース作品を紹介します。',
    },
    contact: {
      title: 'KageRyo Developer - お問い合わせ',
      description: 'メール、GitHub、LinkedIn から Chien-Hsun Chang に連絡できます。ソフトウェア開発、AI システム、オープンソースについて気軽にどうぞ。',
    },
    kserveProject: {
      title: 'KageRyo Developer - KServe (CNCF) へのコントリビュート',
      description: 'Chien-Hsun Chang による CNCF KServe へのコントリビュート：ユーザーのロギング設定を上書きする問題の修正はマージ済み。Ingress の作成を無効にしたときに長すぎるドメインで調整が失敗する問題の修正と、ServingRuntime への runtimeClassName 対応の 2 件はレビュー中です。',
    },
    notFound: { title: 'KageRyo Developer - ページが見つかりません' },
  },
  nav: {
    home: 'ホーム',
    about: '私について',
    projects: 'プロジェクト',
    contact: '連絡先',
  },
  notFound: {
    message: 'お探しのページは見つかりませんでした。',
    backHome: 'ホームに戻る',
  },
  home: {
    hero: {
      introduction: 'こんにちは、健勳です。国立中正大学の情報工学研究科修士課程に在籍し、ソフトウェアエンジニアリング、バックエンド／プラットフォーム、AI システムを主な方向として、要件整理・設計から開発・テスト、デプロイ、運用まで一通り経験してきました。小さなツールの開発やオープンソースへの貢献も好きです。ぜひプロジェクトをご覧ください！ヾ(*´∀ ˋ*)ﾉ',
      academic: '国立中正大学 修士課程｜2027年8月修了予定',
      availability: '2027年の早期採用、および台湾の研究開発代替役（兵役の代わりに企業で研究開発業務に従事する制度）に対応可能',
      viewProjects: 'プロジェクト一覧',
      downloadResume: '履歴書（PDF）',
    },
    quote: {
      main: '人生とコーディングはどちらも print("Hello World"); から始まります。',
      cite: "人の誕生は世界への挨拶であり、'Hello World' は私たちに新しい章を与えます。",
    },
    featuredPhotos: {
      ministry: {
        header: '台湾教育部の潘文忠部長との写真',
        description: '2023年国際発明展金賞受賞学生の接見イベントに参加しました。',
      },
      coscup: {
        header: 'COSCUP',
        description: 'COSCUP 2023のLightning Talkで講演者を務めました。',
      },
    },
    infoCards: {
      header: '自己紹介とプロジェクト',
      previous: '前へ',
      next: '次へ',
      intro: 'はい、それは私です。台湾出身の開発者で、現在 {ccu} の {cs} に在籍し、ソフトウェアエンジニアリング、バックエンド／プラットフォーム、AI システムを主な方向としています。バックエンドシステム、AI／ML システム統合、MLOps、Linux インフラの実務経験があり、CNCF KServe へのコントリビュート、防災デジタルツイン基盤、コンピュータビジョン AI システム、国際連携の連合学習プロジェクトに携わってきました。詳しくは {about} と {projects} をご覧ください。',
      links: {
        ccu: '国立中正大学',
        cs: 'コンピュータサイエンス学科',
        about: '私について',
        projects: 'プロジェクト',
        projectsPage: 'プロジェクト一覧で見る',
      },
      projects: {
        kserve: 'CNCF KServe に継続的にコントリビュートし、Python、Go、Kubernetes のコントローラー／CRD、Helm を扱っています。Python SDK がユーザーのロギングハンドラーを上書きする問題を修正してアップストリームにマージされ、Ingress の作成を無効にしたときの長すぎるドメインの検証の修正と、ServingRuntimePodSpec／WorkerSpec の runtimeClassName 対応も PR を提出し、現在レビュー中です。',
        tagTwin: 'デジタルツインシステム設計グループのリーダーとして 4 名の国際チームを率い、嘉義県民雄郷を検証フィールドとする TAG-Twin を構築。FastAPI、PostgreSQL/PostGIS、Redis でコア基盤を作り、地形・道路・降雨・浸水・リスク情報を統合し、API／WebSocket で洪水シミュレーションと Unreal Engine 5 の可視化をつないでいます。',
        federatedAqi: 'CCU × インドネシア UBM の画像による AQI 連合学習プロジェクトでシステム設計と技術統合を主導。ジャカルタと台湾 6 測定局の計 7 つの Flower クライアントの学習結果をつなぎ、Kubernetes、Kubeflow、KServe で推論とデプロイを統合し、Grafana による監視を構築しました。',
        environmentalEnforcement: '産学連携の環境取締りシステムで、CCTV 映像からポイ捨てや不適切な排泄の疑いがある事象を検出し、人による確認のための証拠を記録します。D-FINE、ByteTrack、姿勢推定、VLM、OCR を組み合わせ、GPU 推論と後処理を分離して重複処理を避け、現場で運用されています。',
        waterMirror: 'モバイルのフロントエンドと WQSurrogateModels バックエンドからなるクロスプラットフォームの AI 水質評価システムを設計・開発。手入力や CSV の水質データから WQI5 スコア、分類、警告を返します。線形回帰、SVM、ランダムフォレスト、XGBoost、LightGBM を比較します。',
      },
    },
  },
  about: {
    personal: {
      basic: {
        male: '男性',
        details: '性別：{gender}・年齢：{age}',
        education: '学歴',
        educationDetail: '国立中正大学 コンピュータサイエンス研究科 修士課程在籍',
        motto: '常に専門分野で最善を尽くして他者を助け、真心と粘り強さで人生のあらゆる挑戦に立ち向かいます。',
      },
      summary: [
        '張健勳です。国立中正大学の情報工学研究科に在籍し、2027 年に修了予定です。学部時代には 1 年間バックエンドエンジニアのインターンとして、Python、Django Ninja、PostgreSQL、MongoDB を使って API、データ検証、データベースモデル、テストの開発に携わり、ソフトウェア開発の一連の流れを経験しました。',
        '大学院に進んでからは、ソフトウェアシステム、プラットフォームエンジニアリング、AI システム、MLOps に軸足を移し、Linux、Docker、Kubernetes、CI/CD、モデルのデプロイに取り組んできました。CNCF KServe へのコントリビュートを通じて、大規模なプロジェクトのコードを読み、修正し、テストを提出する経験も積んでいます。また、授業でデジタル集積回路設計を履修し、Verilog、RTL、APR、DRC/LVS といったフローに触れました。',
        '現在は主に防災デジタルツイン基盤の開発で、バックエンド、データ、プラットフォームの統合を担当し、グループ間のデータ形式、API、システムインターフェースを調整しています。研究室がインドの Saintgits、インドネシアの UBM と連携する国際的な連合学習基盤にも参加し、Kubernetes、Kubeflow、KServe、Grafana を使ってシステム設計、統合、デプロイを担当しています。',
        'システム全体を理解し、問題を分解して実際に解決することが好きで、新しい技術も積極的に学んでいます。統合の問題に向き合うときは、まず要件と制約を整理し、データ・モデル・API・デプロイ環境の間の影響を見極めながら一つずつ検証し、必要に応じて修正してテストやドキュメントを補います。今後はソフトウェア、プラットフォーム、AI システムに関わる仕事で、大規模システム、プラットフォームのデプロイ、高信頼なソフトウェアの実務経験を積みたいと考えています。',
      ],
      resumeDownload: '英語版履歴書（PDF）',
    },
    certificates: {
      header: '資格',
      table: {
        index: '#',
        year: '年',
        name: '名称',
        level: 'レベル',
      },
      count: '合計：{count}',
    },
    resume: {
      education: {
        header: '学歴',
        items: {
          ccu: {
            period: '2025年8月 ~ 2027年8月（修了予定）',
            school: '国立中正大学',
            degree: 'コンピュータサイエンス研究科 修士',
          },
          nutc: {
            period: '2021年9月 ~ 2025年6月',
            school: '国立台中科技大学',
            degree: 'インテリジェント生産工学科 学士',
          },
        },
      },
      experience: {
        header: '職務経歴',
        items: {
          ccuResearch: {
            period: '2025年8月 ~ 現在',
            organization: '国立中正大学',
            role: 'リサーチアシスタント・プロジェクトチームリーダー',
            summary: '国立中正大学の組み込みシステム研究室と人工知能・持続可能な発展研究センターで、AI、スマートシティ、デジタルツインに関する研究とシステム開発に携わり、スマート防災デジタルツインシステム（TAG-Twin）のソフトウェア／バックエンド／AI システム統合、データエンジニアリング、デプロイ、プロジェクト調整を担当しています。',
            highlights: [
              'Python、FastAPI、PostgreSQL／PostGIS で API、空間データサービス、研究データの処理フローを開発。',
              'GIS、シミュレーション結果、モデル出力などの異種データを統合するデータおよび AI／ML 推論パイプラインを構築・保守し、モデル実験、推論サービス、デジタルツインシステムを支えています。',
              'Docker と GitHub Actions で CI/CD、自動デプロイ、システム検証のフローを構築。',
              'プロジェクト計画、タスク分担、技術統合、進捗調整を担当し、教授、国際研究チーム、外部の協力機関と要件や技術について連携しています。',
              'モジュールをまたぐシステム統合、テスト、技術文書の整理に携わり、研究上の要件を実際に動くソフトウェア機能とプラットフォームサービスに落とし込んでいます。',
            ],
            tools: [
              'Python',
              'FastAPI',
              'PostgreSQL / PostGIS',
              'Redis',
              'Docker',
              'GitHub Actions',
              'CI/CD',
              'Linux',
              'REST API',
              'WebSocket',
              'データパイプライン',
              'システム統合',
              '国際チームでの協業',
              'プロジェクト管理',
            ],
          },
          ccuSysadmin: {
            period: '2025年8月 ~ 現在',
            organization: '国立中正大学',
            role: 'システム管理者',
            summary: '国立中正大学の組み込みシステム研究室でシステム管理者として、Linux サーバー、GPU ワークステーション、研究開発環境と関連インフラを保守しています。',
            highlights: [
              '機械学習の学習、研究実験、ソフトウェア開発を支える研究室のサーバーとワークステーションを保守。',
              'Docker の開発・サービス環境を構築・保守し、デプロイ、環境設定、障害に対応。',
              '固定 IP、SSH、リモートアクセス、ストレージ、ユーザー環境などのシステムとネットワーク設定を管理。',
              'サーバーやネットワーク機器の設置、アップグレード、障害対応を支援。',
              '人工知能・持続可能な発展研究センターの持続可能なスマートシティ指令・監視センターの保守を支援。',
            ],
            tools: [
              'Linux',
              'Docker',
              'SSH',
              'Networking',
              'GPU Workstation',
              'Storage',
              'WSL / WSL2',
              'サーバーのデプロイ',
              'システム・ハードウェアの障害対応',
            ],
          },
          paia: {
            period: '2024年7月 ~ 2025年6月',
            organization: 'PAIA Technology Co., Ltd.',
            role: 'バックエンドソフトウェアエンジニア（インターン）',
            summary: 'Playful AI Arena（PAIA）プラットフォームのバックエンド機能の開発、テスト、既存システムの保守に携わりました。',
            highlights: [
              'Python、Django Ninja、Pydantic、PostgreSQL、MongoDB でプラットフォームのバックエンドを開発・保守。',
              'API 設計、データ検証、データ処理、データベースモデルの設計を担当。',
              'ユニットテストと統合テストを書き、API とバックエンドの正しさとシステムの安定性を検証。',
              'バックエンドのロギング、例外処理、データアクセス、既存システムの問題に対応。',
              'Git／GitLab でバージョン管理とチーム開発を行い、Agile／Scrum、デイリーミーティング、コードレビューに参加。',
            ],
            tools: [
              'Python',
              'Django Ninja',
              'Pydantic',
              'MongoDB',
              'REST API',
              'Git / GitLab',
              'Unit Test',
              'Integration Test',
              'Logging',
              'Agile / Scrum',
              'Code Review',
            ],
          },
          codingApe: {
            period: '2023年3月 ~ 2025年6月',
            organization: 'Coding APE プログラミングスクール',
            role: 'プログラミング講師',
            corp: 'Bad Idea株式会社 (CODINGAPE CO., LTD.)',
            summary: 'Bad Idea株式会社（CODINGAPE CO., LTD.）の Coding APE プログラミングスクールで、プログラミングと IT の講座を担当し、受講生の実習を指導しました。',
            highlights: [
              'プログラミングと IT の講座で、受講生がプログラムのロジック、デバッグ、問題解決を理解できるようサポート。',
              '授業内の実習や課題制作を指導し、理解度に合わせて教え方を調整。',
              'プログラミングの概念を受講生のレベルに合わせて分解し、実践力と自力で解決する力を育成。',
            ],
            tools: [
              'プログラミング指導',
              '技術コミュニケーション',
              '問題の分解',
              '実習指導',
            ],
          },
        },
      },
      links: {
        embeddedLab: '国立中正大学 組み込みシステム研究室',
        ai4sdc: '人工知能・持続可能な発展研究センター',
        paia: 'PAIA Technology',
        arena: 'Playful AI Arena',
        codingApe: 'Coding APE プログラミングスクール',
      },
      skills: {
        header: '専門分野・スキル',
        groups: {
          languages: 'プログラミング言語',
          backend: 'ソフトウェアエンジニアリング・バックエンド',
          aiml: 'AI・機械学習',
          platform: 'クラウドネイティブ・MLOps',
          linux: 'Linux システム・GPU サーバー運用',
          projectManagement: 'プロジェクト管理・国際協業',
          digitalIc: 'デジタル IC 設計',
        },
        descriptions: {
          languages: 'Python を主に使い、Go の開発経験もあります。オープンソースのデータツールのうち ReleaseGuard と LineageGuard は Rust で開発しました。',
          backend: 'FastAPI、Django Ninja、Pydantic でバックエンドサービスを開発し、REST API、WebSocket、データ検証、ロギング、例外処理を実装してユニットテストと統合テストを書いています。PostgreSQL／PostGIS、MongoDB、Redis でデータの保存、検索、キャッシュを扱い、データパイプライン、システム統合、異種データの処理にも取り組んできました。',
          aiml: 'PyTorch、scikit-learn、XGBoost、LightGBM で機械学習と深層学習に取り組み、データ処理、学習、評価、推論、システム統合を経験し、複数モデルの比較と再現可能な実験フローも構築しました。AI プロジェクトはコンピュータビジョン、物体検出、追跡、姿勢推定、OCR、視覚言語モデル（VLM）、連合学習にわたり、モデルを API、GPU 推論パイプライン、KServe、監視基盤につなぐ統合とデプロイも経験しています。',
          platform: 'Docker、Kubernetes、Helm、KServe でアプリケーションと AI モデルサービスを構築・デプロイし、コンテナ化、モデルサービング、デプロイ設定、バージョン管理、デプロイ検証を経験。Grafana と Prometheus でサービス状態、モデル結果、システムの監視画面も作っています。GitHub Actions で自動テスト、Docker イメージのビルド、共有検証環境へのデプロイ、PyPI パッケージ、クロスプラットフォームのリリースを含む CI/CD を構築しました。',
          linux: '研究室の Linux サーバー、GPU ワークステーション、研究開発環境の管理を支援し、デプロイ、SSH、ユーザーと権限、固定 IP、ネットワーク、ストレージの設定、ソフトウェア・ハードウェアの障害対応を行っています。Docker／Docker Compose で開発・サービス環境を作り、共有テストホストとバックエンドサービスを保守しています。',
          projectManagement: '研究やソフトウェアのプロジェクトで開発とプロジェクト調整の両方を担い、要件整理、技術仕様の作成、タスクの分割と割り当て、進捗管理、PR レビュー、モジュール間の統合を行っています。台湾とインドネシアの研究チームとの協業経験があり、連合学習による空気質プロジェクトではシステム設計、技術統合、モデルの引き渡し、デプロイ、監視デモを担当しました。',
          digitalIc: 'デジタル集積回路設計の授業で、TSMC N16 AD FP の設計環境を使い、Verilog で RTL 設計と機能シミュレーションを行い、APR（自動配置配線）、DRC（デザインルールチェック）、LVS（レイアウトと回路の一致検証）まで実習しました。',
        },
      },
    },
  },
  projects: {
    featured: {
      items: {
        kserve: {
          title: 'KServe (CNCF)',
          category: 'オープンソース',
          role: 'オープンソースコントリビューター',
          period: '2025年9月 ~ 現在',
          summary: 'CNCF KServe に継続的にコントリビュートし、Python、Go、Kubernetes のコントローラー／CRD、Helm、ServingRuntime を扱っています。Python のロギング設定がユーザーのハンドラーを上書きする問題を修正してアップストリームにマージされ、RawDeployment と disableIngressCreation の組み合わせで長すぎる DNS ホスト名により InferenceService の調整が失敗する問題の修正と、ServingRuntimePodSpec／WorkerSpec の runtimeClassName 対応も提出しています。',
          imageAlt: 'GitHub 上でマージされた KServe のプルリクエスト #4687',
        },
        tagTwin: {
          title: 'スマート防災デジタルツインシステム（TAG-Twin）',
          category: 'バックエンド・デジタルツイン',
          role: 'プロジェクトリード',
          period: '2025年8月 ~ 現在',
          summary: 'デジタルツインシステム設計グループのリーダーとして 4 名の国際チームを率い、国家科学及技術委員会の「シナリオ駆動型の災害シミュレーションと管理技術」研究と「AI で地域のレジリエンスを高める」USR 計画に参加し、嘉義県民雄郷を検証フィールドとする TAG-Twin を構築。FastAPI、Tortoise ORM、PostgreSQL/PostGIS、Redis、Aerich でコア基盤を作り、洪水シミュレーションのデータパイプラインと API／WebSocket を設計して、Unreal Engine 5 のデジタルツイン、避難経路、災害イベントの表示を支えています。',
          imageAlt: '国立中正大学 人工知能・持続可能な発展研究センターの展示ブースにいる張健勳とドローン',
        },
        federatedAqi: {
          title: '国際連携・連合学習による空気質分析・デプロイ基盤',
          category: '連合学習・MLOps',
          role: 'システム設計・統合',
          period: '2026年8月 ~ 2026年9月',
          summary: 'CCU × インドネシア UBM の画像による AQI 連合学習プロジェクトで、システム設計、作業分割、技術統合を主導し、インドネシアのチームや留学生とデータ形式、モデル出力、API、デプロイ仕様を調整しました。モデルの引き渡しとデプロイのデータ契約を設計してジャカルタと台湾 6 測定局の計 7 つの PyTorch／Flower クライアントをつなぎ、Kubernetes、Kubeflow、KServe で推論とデプロイを統合し、Grafana による監視を構築しました。',
          imageAlt: '連合学習による空気質基盤のダッシュボードの前で、張健勳と UBM チームのメンバー',
        },
        environmentalEnforcement: {
          title: 'AI 環境違反取締り映像解析システム',
          category: 'コンピュータビジョン',
          period: '2025年9月 ~ 現在',
          summary: '産学連携の環境取締りシステムで、CCTV 映像からポイ捨てや不適切な排泄の疑いがある事象を検出し、人による確認のためのイベント単位の証拠と構造化された記録を残します。D-FINE、ByteTrack、姿勢推定、VLM、OCR を組み合わせた 2 段階のパイプラインを、Python、PyTorch、Docker Compose、CUDA/TensorRT で構築した GPU 環境で動かし、現場で運用されています。',
          imageAlt: 'CCTV 映像での人物の姿勢と車両の検出結果（人物はモザイク処理済み）',
        },
        waterMirror: {
          title: 'WaterMirror クロスプラットフォーム AI 水質評価システム',
          category: '機械学習・クロスプラットフォームアプリ',
          role: '設計・開発',
          period: '2023年8月 ~ 2024年6月',
          summary: 'モバイルのフロントエンドと WQSurrogateModels バックエンドからなるクロスプラットフォームの AI 水質評価システムを設計・開発。手入力や CSV の水質データから WQI5 スコア、分類、警告を返します。水質の計算式と複数の機械学習モデルを比較し、FastAPI でファイル整合性チェック付きの推論サービスを構築、バックエンドのパッケージを PyPI で公開しました。',
          imageAlt: 'WaterMirror のホーム、水質データ入力、レポート画面',
        },
      },
      status: {
        merged: 'マージ済み',
        open: 'レビュー中',
      },
      privateSource: 'ソースコード非公開',
      related: '関連記事・リンク',
      header: '注目プロジェクト',
    },
    tools: {
      header: 'オープンソースのデータエンジニアリング・ガバナンスツール群',
      description: '複数ソースの研究データを整備する中で繰り返し直面した課題を、単独で使えるオープンソースツールとして切り出したものです。',
      items: {
        releaseGuard: '設定ファイルに基づき、データの列形式、一意性、テーブル間の関係、時系列の順序、ファイルの整合性を検証。GitHub Actions に対応し、Linux・Windows・macOS 向けのバイナリを提供しています。',
        gridForge: '固定仕様の空間グリッドを作成し、点・面・ラスターデータを揃えて、座標系の変換、グリッド ID、データ統合と検証を行います。PyPI で公開しています。',
        lineageGuard: '成果物の出所・識別情報・処理履歴を検証するローカル CLI。',
        evidenceMatrix: '複数ソースのデータセットについて、エンティティごとのソース証拠のカバレッジを監査します。',
        entityLinkage: '外部レコードを正規のエンティティ集合に対応付け、対応なしや複数候補のケースを推測せずにそのまま残します。',
      },
    },
    github: {
      noProjects: '表示できる公開リポジトリはありません。',
      header: 'GitHub上のオープンソースプロジェクト',
      loading: '{tab} の GitHub プロジェクトを読み込み中...',
      errors: {
        rateLimited: {
          title: 'GitHub のリクエスト上限に達しました',
          desc: 'GitHub はサインインしないリクエストの回数を 1 時間ごとに制限しており、お使いのネットワークは現在上限に達しています。しばらくしてからもう一度お試しください。'
        },
        network: {
          title: 'GitHub に接続できません',
          desc: 'インターネット接続を確認して、もう一度お試しください。'
        },
        unavailable: {
          title: 'GitHub が現在プロジェクト一覧を返せません',
          desc: 'GitHub がエラーを返しました。しばらくしてからもう一度お試しください。'
        }
      },
      visitDirectly: 'すべてのプロジェクトを見るには、GitHub プロフィールに直接アクセスできます：',
      visitDirectlyShort: 'GitHub プロフィールに直接アクセスできます：',
      loadingBtn: '読み込み中...',
      retryBtn: '再試行',
      table: {
        index: '#',
        name: '名前',
        url: 'URL',
        desc: '説明',
        noDesc: '説明なし',
        count: '合計：{count}',
      },
    },
  },
  projectDetail: {
    headings: {
      contributions: 'コントリビュートの概要',
      problem: '課題と目標',
      role: '自分の役割・貢献',
      architecture: 'アーキテクチャ・技術',
      tradeoffs: '技術的な選択・トレードオフ',
      outcomes: '成果・検証',
      media: '成果・メディア',
    },
    branch: {
      yes: 'はい',
      no: 'いいえ',
    },
    coverage: 'メディア掲載',
    credit: '出典：{source}',
    viewDetails: 'プロジェクトの詳細を見る',
    backToProjects: 'プロジェクト一覧に戻る',
    kserve: {
      title: 'KServe (CNCF) へのコントリビュート',
      overview: [
        'KServe は、Kubernetes 上で機械学習の推論サービスをデプロイ・管理するための CNCF のオープンソースプラットフォームです。Python SDK がユーザーのロギング設定を上書きしてしまう問題の修正、Ingress の作成を無効にしたときに長すぎるドメイン名で InferenceService の調整（reconcile）が失敗する問題の修正、ServingRuntime で Kubernetes の RuntimeClass を指定できるようにする変更の 3 件を提出しました。',
      ],
      problem: [
        'ロギング設定：log_config を渡さない場合、configure_logging() は常に KServe の既定の dictConfig を適用し、ユーザーが設定済みのハンドラーやフォーマットを上書きしていました。独自のロギングを持つアプリケーションに KServe を組み込みにくい原因になっていました（kserve/kserve#3919）。',
        'ドメイン検証：RawDeployment モードで disableIngressCreation: true の場合、Ingress や HTTPRoute はユーザーが自分で管理し、生成されるドメインは表示用にすぎません。それでも namespace と名前の組み合わせが DNS ラベルの上限 63 文字を超えると、厳密なドメイン検証によって InferenceService の調整が失敗していました（kserve/kserve#4807）。',
        'RuntimeClass：ServingRuntime で runtimeClassName（nvidia、kata、gvisor など）を指定できず、GPU パススルーやサンドボックス型コンテナランタイムを使う際の一般的な要件を満たせませんでした（kserve/kserve#5057）。',
      ],
      role: [
        '3 件とも自分で実装して Pull Request を提出しました。コード変更、ユニットテスト、自動生成ファイルの更新、PR の説明を含みます。',
      ],
      architecture: [
        'Python SDK（kserve/logging.py）：configure_logging() で logger.hasHandlers() により kserve ロガーに直接または継承されたハンドラーがあるかを確認し、log_config が未指定でハンドラーが既にある場合は再設定せずに終了します。',
        'Go コントローラー（ingress/domain.go）：GenerateDomainName() と GenerateInternalDomainName() は、Ingress の作成が有効なときだけ IsFullyQualifiedDomainName() で生成したドメインを検証し、無効なときはそのまま返します。',
        'Go コントローラーと CRD：v1alpha1 の ServingRuntimePodSpec に RuntimeClassName フィールドを追加し、InferenceService の MergePodSpec でマージします。WorkerSpec もインライン埋め込みにより対応します。',
        '自動生成ファイル：CRD（Helm チャートと config）、deepcopy、OpenAPI／Swagger、Python SDK のモデルとドキュメントをまとめて再生成しました。',
      ],
      tradeoffs: [
        '後方互換性：既定の設定を省略するのは「設定が未指定かつハンドラーが既にある」場合だけなので、独自のロギングを持たないユーザーの動作は変わらず、明示的な log_config も引き続き優先されます。',
        'ハンドラーの数ではなく hasHandlers() を使い、親ロガーから継承されたハンドラーも尊重します。',
        'ドメイン検証を緩めるのは disableIngressCreation が true のときだけです。コントローラーが Ingress を作成する場合の検証は変わらず、無効なルーティング設定は引き続き検出されます。',
        'runtimeClassName は schedulerName（kserve/kserve#5073）と同じマージ方式を採用し、既存コードとの一貫性とレビューのしやすさを優先しました。任意フィールドのため、既存の ServingRuntime には影響しません。',
        'E2E テストとドキュメントの更新は今後の課題とし、PR には含めていません。',
      ],
      outcomes: [
        'ロギングの修正（kserve/kserve#4687）は 2026 年 3 月にアップストリームへマージされました。ユーザーのハンドラーの保持、未設定時の既定適用、明示的な設定による上書きの 3 つのユニットテストを追加しています。',
        'ドメイン検証の修正（kserve/kserve#4919）では、Ingress の作成を無効にしたときは長すぎる DNS ラベルでもエラーにならず、有効なときは引き続き検証されることを確かめる 2 つのユニットテストを追加しました。PR は現在レビュー中です。',
        'runtimeClassName 対応（kserve/kserve#5198）では、フィールドのマージと上書きのユニットテストを追加し、runtimeClassName: nvidia の ServingRuntime をローカルで作成して、生成された PodSpec に反映されることを確認しました。',
      ],
      contributions: {
        logging: 'ロギング設定の修正',
        domainValidation: '長すぎるドメインの検証の修正',
        runtimeClassName: 'runtimeClassName 対応',
      },
      diagram: {
        caption: '各変更が効く場所。kserve/kserve#4687、#4919、#5198 のコード変更をもとに作成。',
        steps: {
          logging: [
            'log_config なしで呼び出される',
            '新しいチェック：kserve ロガーに、ユーザーが設定したハンドラー（継承分を含む）があるか？',
            ['そのまま戻り、ユーザーのロギングを維持する', 'KServe の既定のロギング設定を適用する'],
          ],
          domainValidation: [
            'ドメインテンプレートからドメイン名を生成する',
            '新しいチェック：Ingress 設定で Ingress の作成が無効になっているか？',
            ['ドメインをそのまま返す（表示用で、ルーティングはユーザーが管理）', '従来どおり検証し、無効なドメインはエラーを返す'],
          ],
          runtimeClassName: [
            'ServingRuntimePodSpec に追加した任意フィールド（例：nvidia）',
            'InferenceService コントローラーが ServingRuntime と predictor の PodSpec をマージする際にこのフィールドも引き継ぐ',
            'マージ後の PodSpec はその RuntimeClass を使い、predictor 側に指定があればそちらが優先される。WorkerSpec はインライン埋め込みで同じフィールドを持つ',
          ],
        },
      },
    },
  },
  contact: {
    page: {
      heroTitle: 'Chien-Hsun Chang',
    },
    info: {
      header: '連絡先情報',
      discord: 'Discord',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      email: 'メール',
    },
    form: {
      header: '連絡フォーム',
      name: '名前',
      namePlaceholder: 'お名前を教えてください！',
      email: 'メールアドレス',
      emailPlaceholder: '返信できるようにメールアドレスを入力してください！',
      message: '内容',
      messagePlaceholder: 'ご用件やご連絡内容をお知らせください！',
      send: 'メール内容をプレビュー',
      helper: 'このフォームはメールを作成します。送信はメールアプリで行ってください。',
      subjectPrefix: '{name} からの連絡メッセージ',
      bodyTemplate: '名前：{name}\nメール：{email}\n\nメッセージ：\n{message}',
      mailOpened: 'メールアプリを開こうとしました。起動を確認し、メールを送信してください。',
      emailModal: {
        openMail: 'メールアプリを開く',
        title: 'メール内容',
        desc: 'メールアプリが開かない場合は、下の内容をコピーして送信してください。',
        recipient: '宛先',
        subject: '件名',
        body: '本文',
        copyAll: 'すべてコピー',
        close: '閉じる',
        copySuccess: 'メール内容がクリップボードにコピーされました！メールアプリに貼り付けてください。',
        copyFail: 'コピーに失敗しました。上記の内容を手動で選択してコピーしてください。',
      },
    },
  },
  ui: {
    navigation: {
      primary: 'メインナビゲーション',
    },
    language: {
      label: '言語',
    },
    skipToMain: 'メインコンテンツへ移動',
    theme: {
      light: 'ライトモードに切り替え',
      dark: 'ダークモードに切り替え',
    },
    drawer: {
      title: 'ナビゲーション',
      close: 'メニューを閉じる',
    },
  },
};
