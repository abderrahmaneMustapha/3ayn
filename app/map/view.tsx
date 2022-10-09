import * as React from 'react';
import { styled, useTheme, Theme, CSSObject, alpha } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {Button, TextField, Dialog, OutlinedInput, DialogActions,DialogTitle, DialogContent ,useMediaQuery, Box, InputBase, Toolbar, List, CssBaseline, Typography, Divider, IconButton, ListItem, ListItemButton, Avatar, ListItemIcon, ListItemText, FormControl, Input, InputLabel, Stack} from '@mui/material'
import {AddLocationAlt as AddLocationAltIcon ,EventAvailable as Available, EventBusy as Busy, Search as SearchIcon, Inbox as InboxIcon, Mail as MailIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Menu as MenuIcon} from '@mui/icons-material'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import  { Moment } from 'moment';
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
  const icons = [<InboxIcon />, <AddLocationAltIcon />, <MailIcon />]
  const [open, setOpen] = React.useState(false)
  const [openPositionModal, setOpenPositionModal] = React.useState(false)
  const [openSearchResults, setOpenSearchResults] = React.useState(false)
  const [WatterPoints, setWatterPoints] = React.useState<WatterPoint[]>([])
  const [focusedPosition, setFocusedPosition] = React.useState<Position>({ _lat:0, _long:0})
  const [, forceRender] = React.useState({})

  const handleSearchInput = () => {
    setOpenSearchResults(!openSearchResults)
  }

  const fetchWatterPoints = () => {
    getWatterPoints().then((data) => {
      const result = data as WatterPoint[]
      setWatterPoints(result)
      navigator.geolocation.getCurrentPosition(getPositionSuccess, getPositionError, options)
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

  const handleAddPointModal = () => {
    setOpenPositionModal(!openPositionModal)
  }

  const handleSavePointModal = () => {
    setOpenPositionModal(!openPositionModal)
  }

  if (!WatterPoints || !focusedPosition)  return (<div>Loading ...!</div>)

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
          {['الصفحة الرئيسية', 'اقترح عينا جديدة', 'تواصل معنا'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                onClick={handleAddPointModal}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                   {icons[index]}
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
      <NewPointDialog open={openPositionModal} handleCancel={handleAddPointModal} handleSave={handleSavePointModal} />
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
      <React.Fragment key={`${item.id}-fragment`}>
      <ListItemButton key={item.id} onClick={()=> {
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
      <Divider variant="inset" component="li"  key={`${item.id}-divider`}/>
      </React.Fragment>
    ))}
    </List>
  );
}

interface NewPointDialogProps {
  open: boolean
  handleCancel: () => void
  handleSave: () => void
}

const defaultWatterPoint: WatterPoint = {
  id: 0,
  /* TODO: add the possibility to have multi active Times */
  open: {from: {ar: "", js: 0}, to: {ar: "", js: 0}},
  address: "",
  stars: 0,
  title: "",
  description: "",
  position: {_lat: 0, _long: 0},
}

const  NewPointDialog = ({open, handleCancel, handleSave}: NewPointDialogProps) => {
  const [openTime, setOpenTime] = React.useState<Moment | null>(null);
  const [closeTime, setCloseTime] = React.useState<Moment | null>(null);
  const [watterPoint, setWatterPoint] = React.useState<WatterPoint>(defaultWatterPoint)

  const handleOpenTime = (newValue: Moment | null) => {
    handleTimeDataChange('open', newValue)
    setOpenTime(newValue)
    console.log(watterPoint)
  };

  const handleCloseTime = (newValue: Moment | null) => {
    handleTimeDataChange('close', newValue)
    setCloseTime(newValue);
  };

  const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name
    let value = event.target.value
    let data = watterPoint as any

    if (['title', 'address', 'description'].includes(name)) {
      data[name] = value
    } else if (name.includes('position')) {
        let key = name.split('.')[1]
        data['position'][key] = Number(value)
    }
    setWatterPoint(data as WatterPoint)
    console.log(watterPoint)
  }

  const handleTimeDataChange = (state: string, value: Moment | null) => {
    let type = value?.format('A') === 'AM' ? 'صباحا' : 'امساء'
    let data = watterPoint as any
    data[state].js = value?.format('kk')
    data[state].ar =  value?.format('hh') + '' + type
    setWatterPoint(data as WatterPoint)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
    <Dialog
      fullWidth={true}
      maxWidth="md"
      open={open}
    >
    <DialogTitle>
      <Typography fontSize={40}>
        اقترح عينا جديدة
      </Typography>
    </DialogTitle>
    <DialogContent>

      <Stack sx={{padding: "2em"}}direction="column" spacing={4} >
        <FormControl variant="standard">
          <TextField onChange={handleDataChange} name="title" label="اسم العين" placeholder="اقترح للعين اسما" />
        </FormControl>
        <FormControl fullWidth>
          <TextField onChange={handleDataChange} name="address" label="العنوان" placeholder="مثال: اسم الحي او الشارع ، اسم الولاية ، اسم المدينة" />
        </FormControl>
        <div>
          <InputLabel></InputLabel>
          <FormControl>
            <TimePicker
              label="وقت الافتتاح"
              value={openTime}
              onChange={handleOpenTime}
              renderInput={(params) => <TextField name="open" {...params} />}
            />
          </FormControl>
          <FormControl>
            <TimePicker
              label="وقت الاغلاق"
              value={closeTime}
              onChange={handleCloseTime}
              renderInput={(params) => <TextField name="close" {...params} />}
            />
          </FormControl>
        </div>
        <div>
          <FormControl>
            <TextField  type='number' onChange={handleDataChange} name="position._lat" label="الموقع على خط العرض"  placeholder="(lat)الموقع على خط العرض" />
          </FormControl>
          <FormControl>
            <TextField type='number' onChange={handleDataChange} name="position._long" label="الموقع على خط الطول" placeholder="(long)الموقع على خط الطول" />
          </FormControl>
        </div>
        <FormControl fullWidth>
          <TextField onChange={handleDataChange} multiline={true} name="description" label="معلومات اخرى" placeholder="هل لديك اي معلومات او ملاحظات حول هذه العين" />
        </FormControl>
      </Stack>

    </DialogContent>
    <DialogActions>
      <Button onClick={handleCancel}>الغاء</Button>
      <Button variant="contained"  size="large" autoFocus type="submit" onClick={handleSave}>حفظ</Button>
    </DialogActions>
  </Dialog> </LocalizationProvider>)
}
