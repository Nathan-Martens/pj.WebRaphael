import { Route, Routes } from 'react-router-dom';

import './App.css';

import Footer from './components/Footer';
import Header from './components/Header';
import { Menu } from './components/Header/Menu';
import { Principal } from './pages/Principal';

import { Tarefas } from './pages/Tarefas';
import { Perfil } from './pages/Perfil';
import { Responsaveis } from './pages/Responsaveis';

import { CadastrarTarefa } from './pages/CadastrarTarefa';
import { DetalheTarefa } from './pages/DetalheTarefa';
import { EditarTarefa } from './pages/EditarTarefa';

function Home({onLogout}) {
  return (
    <div>
      <Header />
      <Menu />
      <main className='mainApp'>
        <Routes>
          <Route path='/tarefas' element={<Principal />} />
          <Route path='/tarefas' element={<Tarefas />} />
          <Route path='/responsaveis' element={<Responsaveis />} />
          <Route path='/perfil' element={<Perfil onLogout={onLogout} />} />

          <Route path='/cadastrarTarefa' element={<CadastrarTarefa />} />
          <Route path='/detalheTarefa/:id' element={<DetalheTarefa />} />
          <Route path='/editarTarefa/:id' element={<EditarTarefa />} />
          <Route path='/excluirTarefa/:id' element={<Principal />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default Home;
