## DOINSPORT V3 Installation

### 1. Setup

```bash
npm install
ionic serve
```

The project uses NgRx (https://ngrx.io/docs) for state managment, isolating side effects and logging (Redux Devtool extension in chrome).


## 2. End2End Test
 Before running test please start the app locally with "ionic serve"
- run without UI : "npm run cy:run"
- open cypress UI : "npm run cy:open"