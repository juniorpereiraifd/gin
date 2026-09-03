import { createGlobalStyle, css } from 'styled-components';
import MaisonNeueExtExtraThin from 'src/assets/fonts/MaisonNeueExt-ExtraThin.ttf';
import MaisonNeueExtExtraThinItalic from 'src/assets/fonts/MaisonNeueExt-ExtraThinItalic.ttf';
import MaisonNeueExtThin from 'src/assets/fonts/MaisonNeueExt-Thin.ttf';
import MaisonNeueExtThinItalic from 'src/assets/fonts/MaisonNeueExt-ThinItalic.ttf';
import MaisonNeueExtLight from 'src/assets/fonts/MaisonNeueExt-Light.ttf';
import MaisonNeueExtLightItalic from 'src/assets/fonts/MaisonNeueExt-LightItalic.ttf';
import MaisonNeueExtBook from 'src/assets/fonts/MaisonNeueExt-Book.ttf';
import MaisonNeueExtBookItalic from 'src/assets/fonts/MaisonNeueExt-BookItalic.ttf';
import MaisonNeueExtMedium from 'src/assets/fonts/MaisonNeueExt-Medium.ttf';
import MaisonNeueExtMediumItalic from 'src/assets/fonts/MaisonNeueExt-MediumItalic.ttf';
import MaisonNeueExtDemi from 'src/assets/fonts/MaisonNeueExt-Demi.ttf';
import MaisonNeueExtDemiItalic from 'src/assets/fonts/MaisonNeueExt-DemiItalic.ttf';
import MaisonNeueExtBold from 'src/assets/fonts/MaisonNeueExt-Bold.ttf';
import MaisonNeueExtBoldItalic from 'src/assets/fonts/MaisonNeueExt-BoldItalic.ttf';
import MaisonNeueExtExtraBold from 'src/assets/fonts/MaisonNeueExt-ExtraBold.ttf';
import MaisonNeueExtExtraBoldItalic from 'src/assets/fonts/MaisonNeueExt-ExtraBoldItalic.ttf';
import MaisonNeueExtBlack from 'src/assets/fonts/MaisonNeueExt-Black.ttf';
import MaisonNeueExtBlackItalic from 'src/assets/fonts/MaisonNeueExt-BlackItalic.ttf';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtExtraThin}) format('truetype');
    font-weight: 100;
    font-style: normal;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtExtraThinItalic}) format('truetype');
    font-weight: 100;
    font-style: italic;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtThin}) format('truetype');
    font-weight: 200;
    font-style: normal;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtThinItalic}) format('truetype');
    font-weight: 200;
    font-style: italic;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtThin}) format('truetype');
    font-weight: 200;
    font-style: normal;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtThinItalic}) format('truetype');
    font-weight: 200;
    font-style: italic;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtLight}) format('truetype');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtLightItalic}) format('truetype');
    font-weight: 300;
    font-style: italic;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtBook}) format('truetype');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtBookItalic}) format('truetype');
    font-weight: 400;
    font-style: italic;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtMedium}) format('truetype');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtMediumItalic}) format('truetype');
    font-weight: 500;
    font-style: italic;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtDemi}) format('truetype');
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtDemiItalic}) format('truetype');
    font-weight: 600;
    font-style: italic;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtBold}) format('truetype');
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtBoldItalic}) format('truetype');
    font-weight: 700;
    font-style: italic;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtExtraBold}) format('truetype');
    font-weight: 800;
    font-style: normal;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtExtraBoldItalic}) format('truetype');
    font-weight: 800;
    font-style: italic;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtBlack}) format('truetype');
    font-weight: 900;
    font-style: normal;
  }

  @font-face {
    font-family: 'MaisonNeueExt';
    src: url(${MaisonNeueExtBlackItalic}) format('truetype');
    font-weight: 900;
    font-style: italic;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ${({ theme }) => css`
    html {
      font-size: 100% !important;
    }

    body {
      font-family: ${theme.font.family};
      background-color: ${theme.colors.mainBg};
      font-size: ${theme.font.sizes.medium};
    }

    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
      border-radius: 5px;
    }
    ::-webkit-scrollbar {
      width: 5px;
      height: 2px;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: ${theme.colors.darkSecondary}20;
    }
  `}
`;

export default GlobalStyles;
