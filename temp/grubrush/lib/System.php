<?PHP

    ini_set('date.timezone', 'Europe/London');

    // First things first, lets get our path definitions setup                
    $path = explode("/", $_SERVER['DOCUMENT_ROOT']);
    array_pop($path);

    // Set it so everything else knows what path to use
    // define("PHP_ROOT", implode("/", $path)."/");
    // define("LOGS_PATH", PHP_ROOT."/logs/");
         
    define("PHP_ROOT", '../');
    
    // Bring in all the default classes we need to operate
    include(PHP_ROOT."lib/Security.class"); 
    include(PHP_ROOT."lib/Headers.class"); 
    include(PHP_ROOT."lib/Validate.class"); 
    include(PHP_ROOT."lib/Base.class");
    include(PHP_ROOT."lib/ErrorHandler.class");
    include(PHP_ROOT."lib/Debug.class");
    include(PHP_ROOT."lib/XML.class");
    include(PHP_ROOT."lib/Cookie.class");
    include(PHP_ROOT."lib/AES.class");

    Debug::init();

    $config = xml::xml2array(PHP_ROOT."config.xml");

    foreach($config AS $key => $val)
    {
    	// We dont need the @attributes
    	if($key !== "@attributes")
        {   	
        	// Enter each group level
        	foreach($val AS $sKey => $sVal)
            {
    			// Enter group children
    			foreach($sVal AS $ssKey => $ssVal)
                {
    				if($ssKey !== "@attributes")
                    {
                        switch($ssVal['type'])
                        {    
                            case 'boolean':
                            
                                $v = $ssVal['value'] == "true" ? (boolean) TRUE : (boolean) FALSE;
                                define(strtoupper($ssKey), $v);
                                
                            break;
                            
                            default:
                            
                                define(strtoupper($ssKey), $ssVal['value']);
                            
                            break;  
                        }
    				}
    			}    
        	}
        } 
    } 

    // Process the URI so we know what to do
    $info = Base::processUri($_SERVER["REQUEST_URI"]);

    /* General continuity checks */
    if(!IS_PRODUCTION){
        
        if(!Base::is__writable(LOGS_PATH)) $info['build_errors'][] = 101;
        if(!Base::is__writable(PHP_ROOT."xml/")) $info['build_errors'][] = 102;       
        if(!Base::is__writable($_SERVER['DOCUMENT_ROOT']."images/")) $info['build_warnings'][] = 201;
        if(!Base::is__writable($_SERVER['DOCUMENT_ROOT'])) $info['build_warnings'][] = 202;
        if(is_dir(PHP_ROOT."cache/")){
            
            if(!Base::is__writable(PHP_ROOT."cache/")) $info['build_warnings'][] = 301;    
            
        }else{
            
            if(!Base::is__writable(PHP_ROOT."cache/")) $info['build_warnings'][] = 300;    
            
        }      
        
    }

    /* Set session time and begin */
    session_set_cookie_params(COOKIE_TTL, '/', COOKIE_DOMAIN, false, false);
    session_start();

    if(IS_PRODUCTION === FALSE) error_reporting(E_ALL & ~E_NOTICE);

?>