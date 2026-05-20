import { IoHomeSharp } from "react-icons/io5";
import { FaExchangeAlt } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { IoBookmarks } from "react-icons/io5";

export const sidebarData = [
  { label: 'Home', path: '/', icon: IoHomeSharp },
  {
    label: 'Empréstimos',
    icon: FaExchangeAlt,
    children: [
      { label: 'Novo', path: '/loans/new' },
      { label: 'Listar', path: '/loans' },
    ]
  },
  {
    label: 'Livros',
    icon: FaBook,
    children: [
      { label: 'Exemplares',
          children: [
            { label: 'Novo', path: '/books/exemplars/new' },
            { label: 'Listar', path: '/books/exemplars' },
          ]
       },
      { label: 'Livros',
          children: [
            { label: 'Novo', path: '/books/new' },
            { label: 'Listar', path: '/books/exemplar' },
          ]
      },
      {
        label: 'Gerenciar',
        children: [
          { label: 'Autores',
              children: [
                { label: 'Novo', path: '/book/author/register' },
                { label: 'Listar', path: '/book/author/list' },
              ]
          },
          { label: 'Gêneros',
              children: [
                { label: 'Novo', path: '/book/genre/register' },
                { label: 'Listar', path: '/book/genre/list' },
              ]
          },
          { label: 'Editoras',
              children: [
                { label: 'Novo', path: '/book/publisher/register' },
                { label: 'Listar', path: '/book/publisher/list' },
              ]
          },
        ]
      }
    ]
  },
  { 
    label: 'Biblioteca', 
    icon: IoBookmarks,
    children: [
      { label: 'Membros', 
        children: [
          { label: 'Novo', path: '/members/new' },
          { label: 'Listar', path: '/members' },
        ]
      },
      { label: 'Setores',
        children: [
          { label: 'Novo', path: '/library/sector/register' },
          { label: 'Listar', path: '/library/sector/list' },
        ]
      },
      { label: 'Prateleiras',
        children: [
          { label: 'Novo', path: '/library/shelf/register' },
          { label: 'Listar', path: '/library/shelf/list' },
        ]
      },
      { label: 'Usuários', roles: ['admin'],
        children: [
          { label: 'Novo', path: '/user/register' },
          { label: 'Listar', path: '/user/list' },
        ]
      },
      { label: 'Biblioteca', roles: ['admin'],
        children: [
          { label: 'Editar', path: '/library/edit', },
        ]
      }
    ]
  },
]