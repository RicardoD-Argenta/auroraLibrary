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
                { label: 'Novo', path: '/books/authors/new' },
                { label: 'Listar', path: '/books/authors' },
              ]
          },
          { label: 'Gêneros',
              children: [
                { label: 'Novo', path: '/books/genres/new' },
                { label: 'Listar', path: '/books/genres' },
              ]
          },
          { label: 'Editoras',
              children: [
                { label: 'Novo', path: '/books/publishers/new' },
                { label: 'Listar', path: '/books/publishers' },
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
          { label: 'Novo', path: '/sets/new' },
          { label: 'Listar', path: '/sets' },
        ]
      },
      { label: 'Prateleiras',
        children: [
          { label: 'Novo', path: '/shelves/new' },
          { label: 'Listar', path: '/shelves' },
        ]
      },
      { label: 'Usuários',
        children: [
          { label: 'Novo', path: '/users/new' },
          { label: 'Listar', path: '/users' },
        ]
      },
      { label: 'Biblioteca',
        children: [
          { label: 'Editar', path: '/libraries/edit' },
        ]
      }
    ]
  },
]