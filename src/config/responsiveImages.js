// Explicit imports let Vite hash and package each responsive candidate.
import brand from '../../assets/img/card.webp'
import brand400 from '../../assets/img/responsive/card-400.webp'
import brand800 from '../../assets/img/responsive/card-800.webp'
import ministry from '../../assets/img/ministry-of-education.webp'
import ministry400 from '../../assets/img/responsive/ministry-of-education-400.webp'
import ministry800 from '../../assets/img/responsive/ministry-of-education-800.webp'
import coscup from '../../assets/img/coscup-lightingtalk.webp'
import coscup400 from '../../assets/img/responsive/coscup-lightingtalk-400.webp'
import coscup800 from '../../assets/img/responsive/coscup-lightingtalk-800.webp'
import portrait from '../../assets/img/chienhsun.webp'
import portrait400 from '../../assets/img/responsive/chienhsun-400.webp'
import portrait800 from '../../assets/img/responsive/chienhsun-800.webp'
import kserve from '../../assets/img/kserve-merge.webp'
import kserve400 from '../../assets/img/responsive/kserve-merge-400.webp'
import tagTwin from '../../assets/img/tag-twin.webp'
import tagTwin400 from '../../assets/img/responsive/tag-twin-400.webp'
import federatedAqi from '../../assets/img/federated-aqi.webp'
import federatedAqi400 from '../../assets/img/responsive/federated-aqi-400.webp'
import environmentalEnforcement from '../../assets/img/environmental-enforcement.webp'
import environmentalEnforcement400 from '../../assets/img/responsive/environmental-enforcement-400.webp'
import waterMirror from '../../assets/img/watermirror.webp'
import waterMirror400 from '../../assets/img/responsive/watermirror-400.webp'

export const responsiveImages = {
  brand: {
    src: brand,
    srcset: `${brand400} 400w, ${brand800} 800w, ${brand} 1600w`
  },
  ministry: {
    src: ministry,
    srcset: `${ministry400} 400w, ${ministry800} 800w, ${ministry} 1200w`
  },
  coscup: {
    src: coscup,
    srcset: `${coscup400} 400w, ${coscup800} 800w, ${coscup} 1200w`
  },
  portrait: {
    src: portrait,
    srcset: `${portrait400} 400w, ${portrait800} 800w, ${portrait} 900w`
  },
  kserve: { src: kserve, srcset: `${kserve400} 400w, ${kserve} 800w` },
  tagTwin: { src: tagTwin, srcset: `${tagTwin400} 400w, ${tagTwin} 800w` },
  federatedAqi: {
    src: federatedAqi,
    srcset: `${federatedAqi400} 400w, ${federatedAqi} 800w`
  },
  environmentalEnforcement: {
    src: environmentalEnforcement,
    srcset: `${environmentalEnforcement400} 400w, ${environmentalEnforcement} 800w`
  },
  waterMirror: {
    src: waterMirror,
    srcset: `${waterMirror400} 400w, ${waterMirror} 800w`
  }
}
