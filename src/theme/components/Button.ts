export const Button = {
  defaultProps: {
    _text: {
      fontWeight: 600,
    },
    borderRadius: 12,
  },
  sizes: {
    xs: {
      height: '32px',
      padding: '7px 12px',
      _text: {
        fontSize: '15px',
        lineHeight: '16px',
      },
    },
    sm: {
      height: '40px',
    },
    lg: {
      height: '56px',
    },
  },
  variants: {
    primary: {
      bg: 'primary.500',
      _text: {
        color: 'white',
      },
    },
    secondary: {
      bg: '#F6F6FA',
      _text: {
        color: '#F36D32',
      },
    },
    outline: {
      bg: 'Medium Grey',
      borderColor: 'primary.500',
      _text: {
        color: 'primary.500',
      },
    },
  },
};
