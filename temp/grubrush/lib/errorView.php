<?php

// Unique error identifier
$error_id = uniqid('error');

?>

<style type="text/css">

    #squash_error { 
        background: #fff; 
        font-size: 1em; 
        font-family:sans-serif; 
        text-align: left; 
        color: #111;
        padding: 1em;
    }
    
    #squash_error h1 {  
        font-size: 1.4em; 
        font-weight: normal; 
        color: #FF1111;
        display: block; 
        border-bottom: 1px #d9d9d9 solid;
        padding: 0 0 10px 0;
        margin: 0 0 10px 0;
    }
    
    #squash_error h2{
        font-size: 0.9em;
        color: #222;
    }
    
    #squash_error h3 { 
        margin: 0; 
        padding: 0.4em 0 5px 0; 
        font-size: 0.8em; 
        font-weight: normal;
    }
    
    #squash_error p { 
        margin: 0; 
        padding: 0.2em 0; 
    }
    
    #squash_error a { 
        color: #1b323b;
    }
    
    #squash_error pre { 
        overflow: auto; 
        white-space: pre-wrap; 
    }
    
    #squash_error table { 
        width: 100%; 
        display: block; 
        margin: 0 0 0.4em; 
        padding: 0; 
        border-collapse: collapse; 
        background: #fff;
    }
    
    #squash_error table td { 
        border: solid 1px #ddd; 
        text-align: left; 
        vertical-align: middle;
        padding: 0.4em;
        font-size: 0.9em;
    }
    
    #squash_error table td pre{
        margin: 0;
    }
    
    #squash_error div.content {      
        overflow: hidden; 
    }
    
    #squash_error pre.source {  
        background: #000;  
        margin: 5px 0 0 0;
    }
    
    #squash_error pre.source span.line { 
        display: block;
        color: #888;
        line-height: 1.4em;  
    }
    
    #squash_error pre.source span.highlight { 
        background: #222;
        color: #FF4040; 
    }
    
    #squash_error pre.source span.line span.number { 
        color: #888; 
        background: #fff;
        line-height: 1.4em;
        width: 30px;
        display: block;
        float: left;
    }
    
    #squash_error ol.trace { 
        display: block; 
        margin: 0 0 0 2em; 
        padding: 0; 
        font-size: 1em;
        list-style: decimal; 
    }
    
    #squash_error ol.trace li { 
        margin: 0; 
        padding: 0; 
        font-size: 0.8em;
    }
    
    .js .collapsed { 
        display: none; 
    }
    
    .title{
        font-weight: bold;
        display: block;
        font-size: 0.8em;
        padding: 0 0 3px 0;
    }

    .path{
        font-size: 0.8em;
    }
    
    .p_t_10{
        margin: 10px 0 0 0;
    }
    
    #squash_error div#environment{
        border-top: 1px #d9d9d9 solid;
        padding: 10px 0 0 0;
        margin: 20px 0 0 0;
        
    }
    
</style>

<script type="text/javascript">
    
    document.documentElement.className = 'js';
    
    function koggle(elem){
        
        elem = document.getElementById(elem);

        if (elem.style && elem.style['display'])
            // Only works with the "style" attr
            var disp = elem.style['display'];
        else if (elem.currentStyle)
            // For MSIE, naturally
            var disp = elem.currentStyle['display'];
        else if (window.getComputedStyle)
            // For most other browsers
            var disp = document.defaultView.getComputedStyle(elem, null).getPropertyValue('display');

        // Toggle the state of the "display" style
        elem.style.display = disp == 'block' ? 'none' : 'block';
       
        return false;
        
    }
    
</script>

<div id="squash_error">
    <h1>
        <span class="type"><?php echo $type ?> [ <?php echo $code ?> ] ::</span> 
        <span class="message"><?php echo self::chars($message) ?></span>
    </h1>
    <div id="<?php echo $error_id ?>" class="content">
        <p> 
            <span class="title">Path :</span>
            <span class="path"><?php echo self::debug_path($file) ?> [ <?php echo $line ?> ]</span>
        </p>
        <span class="title p_t_10">Source :</span>
        <?php echo self::debug_source($file, $line) ?>
        <span class="title p_t_10">Stack Trace :</span>
        <ol class="trace">
        <?php foreach (self::trace($trace) as $i => $step): ?>
            <li>
                <p>
                    <span class="file">
                        <?php if ($step['file']): $source_id = $error_id.'source'.$i; ?>
                            <a href="#<?php echo $source_id ?>" onclick="return koggle('<?php echo $source_id ?>')"><?php echo self::debug_path($step['file']) ?> [ <?php echo $step['line'] ?> ]</a>
                        <?php else: ?>
                            PHP internal call
                        <?php endif ?>
                    </span>
                    &raquo;
                    <?php echo $step['function'] ?>(<?php if ($step['args']): $args_id = $error_id.'args'.$i; ?><a href="#<?php echo $args_id ?>" onclick="return koggle('<?php echo $args_id ?>')">arguments</a><?php endif ?>)
                </p>
                <?php if (isset($args_id)): ?>
                <div id="<?php echo $args_id ?>" class="collapsed">
                    <table cellspacing="0">
                    <?php foreach ($step['args'] as $name => $arg): ?>
                        <tr>
                            <td><code><?php echo $name ?></code></td>
                            <td><pre><?php echo self::dump($arg) ?></pre></td>
                        </tr>
                    <?php endforeach ?>
                    </table>
                </div>
                <?php endif ?>
                <?php if (isset($source_id)): ?>
                    <pre id="<?php echo $source_id ?>" class="source collapsed"><code><?php echo $step['source'] ?></code></pre>
                <?php endif ?>
            </li>
            <?php unset($args_id, $source_id); ?>
        <?php endforeach ?>
        </ol>
    </div>
    
    <div id="environment">
        <h2>
            <a href="#<?php echo $env_id = $error_id.'environment' ?>" onclick="return koggle('<?php echo $env_id ?>')">Environment</a>
        </h2>
        <div id="<?php echo $env_id ?>" class="content">
            <?php $included = get_included_files() ?>
            <h3><a href="#<?php echo $env_id = $error_id.'environment_included' ?>" onclick="return koggle('<?php echo $env_id ?>')">Included files</a> (<?php echo count($included) ?>)</h3>
            <div id="<?php echo $env_id ?>" class="collapsed">
                <table cellspacing="0">
                    <?php foreach ($included as $file): ?>
                    <tr>
                        <td><code><?php echo self::debug_path($file) ?></code></td>
                    </tr>
                    <?php endforeach ?>
                </table>
            </div>
            <?php $included = get_loaded_extensions() ?>
            <h3><a href="#<?php echo $env_id = $error_id.'environment_loaded' ?>" onclick="return koggle('<?php echo $env_id ?>')">Loaded extensions</a> (<?php echo count($included) ?>)</h3>
            <div id="<?php echo $env_id ?>" class="collapsed">
                <table cellspacing="0">
                    <?php foreach ($included as $file): ?>
                    <tr>
                        <td><code><?php echo self::debug_path($file) ?></code></td>
                    </tr>
                    <?php endforeach ?>
                </table>
            </div>
            <?php foreach (array('_SESSION', '_GET', '_POST', '_FILES', '_COOKIE', '_SERVER') as $var): ?>
            <?php if (empty($GLOBALS[$var]) OR ! is_array($GLOBALS[$var])) continue ?>
            <h3><a href="#<?php echo $env_id = $error_id.'environment'.strtolower($var) ?>" onclick="return koggle('<?php echo $env_id ?>')">$<?php echo $var ?></a></h3>
            <div id="<?php echo $env_id ?>" class="collapsed">
                <table cellspacing="0">
                    <?php foreach ($GLOBALS[$var] as $key => $value): ?>
                    <tr>
                        <td><code><?php echo self::chars($key) ?></code></td>
                        <td><pre><?php echo self::dump($value) ?></pre></td>
                    </tr>
                    <?php endforeach ?>
                </table>
            </div>
            <?php endforeach ?>
        </div>
    </div>
</div>
