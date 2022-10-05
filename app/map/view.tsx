import * as React from 'react';
import { styled, useTheme, Theme, CSSObject, alpha } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {Box, InputBase, Toolbar, List, CssBaseline, Typography, Divider, IconButton, ListItem, ListItemButton, Avatar, ListItemIcon, ListItemText} from '@mui/material'
import {EventAvailable as Available, EventBusy as Busy, Search as SearchIcon, Inbox as InboxIcon, Mail as MailIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Menu as MenuIcon} from '@mui/icons-material'
import Map from './map'
import { Position, WatterPoint } from '../../types/index'
import { getWatterPoints } from '../utils/firebase/firebase'

const drawerWidth = 240;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const options = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 1000
};

export default function MiniDrawer() {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [openSearchResults, setOpenSearchResults] = React.useState(false)
  const [WatterPoints, setWatterPoints] = React.useState<WatterPoint[]>([])
  const [focusedPosition, setFocusedPosition] = React.useState<Position>({ _lat:0, _long:0})
  const [, forceRender] = React.useState({})

  const handleSearchInput = () => {
    setOpenSearchResults(!openSearchResults)
  }

  const fetchWatterPoints = () => {
    getWatterPoints().then((data) => {
      console.log(data[0].position)
      const result = data as WatterPoint[]
      setWatterPoints(result)
      setFocusedPosition(result[0].position)
    })
  }

  const getPositionSuccess = (pos:any)=> {
    const crd = pos.coords
    setFocusedPosition({_lat: crd.latitude, _long: crd.longitude})
  }

  const getPositionError = (err:any)=> {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }


  React.useEffect(() => {
    fetchWatterPoints()
    navigator.geolocation.getCurrentPosition(getPositionSuccess, getPositionError, options)
  }, [])

  const handleUpdateFocusedPos = (position: Position) => {
    setFocusedPosition(position)
    forceRender({})
  }

  const handleSearchResult = (query: string) => {
    if (!query) {
      fetchWatterPoints()
    } else {
      let newWatterPoints = WatterPoints?.filter((WatterPoint) => {
        return WatterPoint.title.includes(query) || WatterPoint.description?.includes(query)
      })
      setWatterPoints(newWatterPoints)
      forceRender({})
      if (newWatterPoints) {
        handleUpdateFocusedPos(newWatterPoints[0].position)
      }
    }
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  if (!WatterPoints || !focusedPosition)  return (<div> aych</div>)
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
           عين
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onClick={handleSearchInput}
              onChange={(event) => handleSearchResult(event.target.value)}
              placeholder="ابحث..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['الصفحة الرئيسية', 'تواصل معنا'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{flexGrow: 1, p: 3, backgroundColor: '#FBFBFB'}}>
        <DrawerHeader />
        <Box
          component="div"
          sx={{
            display: 'flex',
            maxHeight: window.innerHeight,
            minHeight: window.innerHeight,
            backgroundColor: '#FBFBFB'
          }}
        >
          <Box
            component="div"
            sx={{width: 3.2/8, backgroundColor: '#FBFBFB'}}
          >
            <Items items={WatterPoints} handleUpdateFocusedPos={handleUpdateFocusedPos}/>
          </Box>
          <Box
            component="div"
            sx={{width: 4.8/8}}
          >
            <Map items={WatterPoints} focusedPosition={focusedPosition}/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

interface ItemsProps {
  items: WatterPoint[]
  handleUpdateFocusedPos: (position: Position) => void
}

function Items({items, handleUpdateFocusedPos}: ItemsProps) {
  const [currentTime, _] = React.useState<number>(new Date().getHours() + 1)

  const isOpen = (item: WatterPoint) => {
    return currentTime >= item.open.from.js && currentTime <= item.open.to.js
  }

  return (
    <List sx={{ width: '100%', overflow: 'auto', maxHeight: 1 ,bgcolor: 'background.paper' }}>
    {items.map((item) => (
      <React.Fragment key={item.id}>
      <ListItemButton onClick={()=> {
        console.log(item.position)
        handleUpdateFocusedPos(item.position)
      }}>
          {isOpen(item) ?
            <Avatar sx={{backgroundColor: '#4CDFAD'}}>
              <Available />
            </Avatar>:
            <Avatar sx={{backgroundColor: '#F0204E'}}>
              <Busy />
            </Avatar>
          }
        <ListItemText
          sx={{marginInline: '0.5em'}}
          primary={
            <Typography
                sx={{ display: 'inline', fontWeight: 'bold' }}
                component="p"
              >
                {item.title}
              </Typography>

          }
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {`مفتوح على الساع ${item.open.from.ar}`}
              </Typography>
              {` — ${item.address}`}
            </React.Fragment>
          }
        />
      </ListItemButton>
      <Divider variant="inset" component="li" />
      </React.Fragment>
    ))}
    </List>
  );
}
